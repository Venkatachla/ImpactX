import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

import sys
import os
import re
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.repository_scanner import scan_repository
from services.parser import StructuralParser
from services.dependency_graph import DependencyGraph
from services.change_analyzer import ChangeAnalyzer
from services.impact_analyzer import ImpactAnalyzer
from services.test_recommender import TestRecommender
from services.ownership_analyzer import OwnershipAnalyzer
from services.ci_analyzer import CiAnalyzer
from services.risk import RiskEngine
from services.gemini import GeminiService

app = FastAPI(title="ImpactX API Server")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRepoRequest(BaseModel):
    repoPath: str
    appMode: Optional[str] = "real"

class AnalyzeImpactRequest(BaseModel):
    repoPath: str
    diffMode: Optional[str] = "demo"
    appMode: Optional[str] = "real"

# Global state mapping representing repository baseline snapshots
BASELINE_SNAPSHOTS = {}

import traceback
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    """
    Catch-all fallback global handler preventing unhandled HTTP 500 error blockages
    """
    error_trace = traceback.format_exc()
    print(f"CRITICAL BACKEND ERROR:\n{error_trace}")
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "details": error_trace
        }
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "ImpactX Analysis Engine Active"}

@app.post("/api/repositories/promote")
def promote_baseline(req: AnalyzeRepoRequest):
    """
    Promotes the latest analyzed changes to become the new baseline snapshot.
    """
    path = req.repoPath
    if not os.path.exists(path):
        path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo-repo"))
        
    scanned = scan_repository(path)
    parsed_data = {}
    for file_rel in scanned["files"]:
        entities = StructuralParser.parse_file(path, file_rel)
        if entities:
            parsed_data[file_rel] = entities
            
    dep_graph = DependencyGraph()
    dep_graph.build_graph(path, scanned, parsed_data)
    BASELINE_SNAPSHOTS[path] = dep_graph
    
    return {"status": "success", "message": "Current state successfully promoted to new baseline snapshot"}

@app.post("/api/repositories/analyze")
def analyze_repository(req: AnalyzeRepoRequest):
    # Resolve relative/absolute path or clone remote git url
    path = req.repoPath
    print(f"[API] Received analyze_repository request. path={path}, appMode={req.appMode}")
    
    if path.startswith("http://") or path.startswith("https://"):
        import shutil
        from git import Repo
        
        safe_name = re.sub(r'[^a-zA-Z0-9]', '_', path)
        temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "cloned_repos", safe_name))
        git_dir = os.path.join(temp_dir, ".git")
        
        print(f"[API] Cloned repo destination resolved to: {temp_dir}")
        
        is_valid_repo = False
        if os.path.exists(git_dir):
            try:
                # Try opening git repo to verify validity
                repo = Repo(temp_dir)
                # Verify remote URL matches
                if len(repo.remotes) > 0 and repo.remotes.origin.url in {path, path + ".git", path.rstrip("/")}:
                    print(f"[API] Valid repository exists. Reusing clone path: {temp_dir}")
                    is_valid_repo = True
                repo.close()
            except Exception as e:
                print(f"[API] Existing directory invalid. Error: {str(e)}")
                
        if not is_valid_repo:
            print(f"[API] Directory invalid/missing. Initiating cleanup/creation...")
            if os.path.exists(temp_dir):
                # Try cleaning up securely or fallback to a unique subdirectory key
                def handle_remove_readonly(func, path, exc):
                    import stat
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                try:
                    shutil.rmtree(temp_dir, onerror=handle_remove_readonly)
                except Exception as e:
                    # Fallback to unique folder name suffix to avoid permissions failure blocking
                    import time
                    unique_suffix = f"_{int(time.time())}"
                    temp_dir = temp_dir + unique_suffix
                    print(f"[API] Permission error, fallback unique folder path: {temp_dir}")
            
            os.makedirs(temp_dir, exist_ok=True)
            try:
                print(f"[API] Launching git clone of: {path}")
                # Fetch full history for commit checks later
                Repo.clone_from(path, temp_dir)
                path = temp_dir
                print(f"[API] Clone completed successfully. path={path}")
            except Exception as e:
                err_msg = str(e)
                print(f"[API] Error cloning repository: {err_msg}")
                if "Authentication failed" in err_msg or "could not read Username" in err_msg:
                    raise HTTPException(status_code=400, detail="Repository requires authentication or is inaccessible.")
                raise HTTPException(status_code=400, detail=f"Failed to clone remote repository: {err_msg}")
        else:
            path = temp_dir
            
    if not os.path.exists(path):
        raise HTTPException(status_code=400, detail=f"Specified local repository path does not exist on disk: {path}")
        
    print(f"[API] Starting scanner on resolved path: {path}")
    scanned = scan_repository(path)
    print(f"[API] Scanner completed. Found {len(scanned.get('files', []))} files, {len(scanned.get('tests', []))} tests.")
    
    # Parse each file
    parsed_data = {}
    for file_rel in scanned["files"]:
        entities = StructuralParser.parse_file(path, file_rel)
        if entities:
            parsed_data[file_rel] = entities
            
    # Build graph
    dep_graph = DependencyGraph()
    dep_graph.build_graph(path, scanned, parsed_data)
    nx_graph = dep_graph.get_networkx_graph()
    print(f"[API] Graph built. Nodes: {nx_graph.number_of_nodes()}, Edges: {nx_graph.number_of_edges()}")
    
    # Cache baseline representation
    BASELINE_SNAPSHOTS[path] = dep_graph
    
    # Format graph nodes and edges for React Flow
    nodes = []
    edges = []
    
    for node, data in nx_graph.nodes(data=True):
        nodes.append({
            "id": node,
            "type": data.get("type", "FILE"),
            "data": {"label": data.get("label", node), "path": data.get("path", "")}
        })
        
    for u, v, data in nx_graph.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "label": data.get("relationship", "")
        })
        
    return {
        "metadata": scanned["metadata"],
        "files": scanned["files"],
        "tests": scanned["tests"],
        "workflows": scanned["workflows"],
        "graph": {
            "nodes": nodes,
            "edges": edges
        }
    }

@app.post("/api/impact/analyze")
def analyze_impact(req: AnalyzeImpactRequest):
    # Resolve path or clone remote git url
    path = req.repoPath
    if path.startswith("http://") or path.startswith("https://"):
        safe_name = re.sub(r'[^a-zA-Z0-9]', '_', path)
        path = os.path.join(os.path.dirname(__file__), "..", "cloned_repos", safe_name)

    if not os.path.exists(path):
        path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo-repo"))
        
    # 1. Scan & Parse
    scanned = scan_repository(path)
    parsed_data = {}
    for file_rel in scanned["files"]:
        entities = StructuralParser.parse_file(path, file_rel)
        if entities:
            parsed_data[file_rel] = entities
            
    # 2. Retrieve Baseline Graph or build V1
    if path in BASELINE_SNAPSHOTS:
        baseline_graph_obj = BASELINE_SNAPSHOTS[path]
        nx_graph = baseline_graph_obj.get_networkx_graph()
    else:
        dep_graph = DependencyGraph()
        dep_graph.build_graph(path, scanned, parsed_data)
        nx_graph = dep_graph.get_networkx_graph()
        BASELINE_SNAPSHOTS[path] = dep_graph
    
    # 3. Detect Change
    diff_mode_to_use = req.diffMode
    if req.appMode == "real" and diff_mode_to_use == "demo":
        diff_mode_to_use = "git"
        
    try:
        changes = ChangeAnalyzer.detect_change(path, diff_mode_to_use)
    except Exception as e:
        error_msg = str(e)
        return {
            "change": None,
            "risk": {"score": 0, "level": "LOW", "confidence": 0, "breakdown": []},
            "summary": {"files": 0, "modules": 0, "services": 0, "apis": 0, "tests": 0, "teams": 0, "ciWorkflows": 0},
            "graph": {"nodes": [], "edges": []},
            "impacts": [],
            "tests": [],
            "teams": [],
            "ci": [],
            "aiAnalysis": {
                "failureExplanation": error_msg,
                "remediation": "Please verify commit history depth and check if HEAD~1 is accessible.",
                "migrationAdvice": "N/A",
                "suggestedTest": "N/A"
            },
            "prComment": f"⚡ **ImpactX Change Analysis**\n\nComparison failed: {error_msg}"
        }

    if not changes:
        return {
            "change": None,
            "risk": {"score": 0, "level": "LOW", "confidence": 100, "breakdown": []},
            "summary": {"files": 0, "modules": 0, "services": 0, "apis": 0, "tests": 0, "teams": 0, "ciWorkflows": 0},
            "graph": {"nodes": [], "edges": []},
            "impacts": [],
            "tests": [],
            "teams": [],
            "ci": [],
            "aiAnalysis": {
                "failureExplanation": "No code changes detected in this commit or working tree comparison.",
                "remediation": "Verify modifications have been checked in or run working tree validations.",
                "migrationAdvice": "N/A",
                "suggestedTest": "N/A"
            },
            "prComment": "⚡ **ImpactX Change Analysis**\n\nNo changes detected."
        }

    # Aggregate blast radius traversal across ALL changed files
    impacted = {}
    for change in changes:
        changed_node = None
        # Locate matches in graph
        for node in nx_graph.nodes:
            if change.get("symbol") in node or change.get("file") in node:
                changed_node = node
                break
        
        if not changed_node:
            changed_node = change.get("file")
            if not nx_graph.has_node(changed_node):
                nx_graph.add_node(changed_node, type="FILE", label=os.path.basename(changed_node))
        
        # Blast Radius traversal
        file_impacted = ImpactAnalyzer.analyze_impact(nx_graph, changed_node)
        impacted.update(file_impacted)

    # 5. Extract specific stats for response
    files_affected = set()
    services_affected = set()
    apis_affected = set()
    frontend_affected = set()
    
    for node_id, data in impacted.items():
        n_type = data["type"]
        raw_path = data["path"] or node_id
        path_str = " -> ".join(raw_path) if isinstance(raw_path, list) else str(raw_path)
        
        # Ensure only actual source files (java/ts/tsx/js/py) are counted as files, not arbitrary intermediate classes
        if path_str.endswith((".java", ".ts", ".tsx", ".js", ".py")):
            files_affected.add(path_str)
        
        if "Service" in node_id:
            services_affected.add(data["label"])
        elif n_type == "API":
            apis_affected.add(data["label"])
        elif n_type == "FRONTEND" or path_str.endswith(('.tsx', '.ts')):
            frontend_affected.add(data["label"])

    # 6. CI and Team Ownership
    ci_workflows = CiAnalyzer.analyze_ci(scanned["workflows"], impacted, path)
    teams = OwnershipAnalyzer.get_affected_teams(impacted, scanned["codeowners_path"])
    
    # 7. Recommended Tests
    tests = TestRecommender.recommend_tests(impacted, scanned["tests"])
    
    # 8. Deterministic Risk
    # Match the primary change out of changes list
    primary_change = changes[0]
    risk = RiskEngine.calculate_risk(primary_change, impacted)
    
    # 9. Gemini AI explanation
    # Derive real primary path from impacted BFS records
    primary_path = [primary_change.get("file")]
    if impacted:
        # Sort by depth and collect actual labels
        sorted_impacts = sorted(impacted.values(), key=lambda x: x.get("depth", 0))
        for imp in sorted_impacts[:3]:
            primary_path.append(imp.get("label", imp.get("id")))
            
    ai_reasoning = GeminiService.get_ai_reasoning(primary_change, primary_path)
    
    # 10. Generate PR Comment (Official Bonus)
    path_formatted = " → ".join([f"`{p}`" for p in primary_path])
    pr_comment = f"""⚡ **ImpactX Change Analysis**
 
Risk: 🔴 **{risk['level']}** — {risk['score']}/100
Confidence: **{risk['confidence']}%**
 
### Blast Radius
- {len(files_affected)} files
- {len(services_affected)} services
- {len(apis_affected)} API contracts
- {len(tests)} relevant tests
- {len(teams)} teams
- {len(ci_workflows)} CI workflows
 
### Critical Path
{path_formatted}
 
*Potential code change blast radius trace complete.*
 
### Recommended Tests
{chr(10).join([f"✓ {t['name']} - *{t['reason']}*" for t in tests]) if tests else "No tests recommended."}
 
### Affected Teams
{chr(10).join([f"- **{t['name']}**: {t['reason']}" for t in teams]) if teams else "No teams affected."}
 
### Affected CI Workflows
{chr(10).join([f"- `{w['name']}`: {w['reason']}" for w in ci_workflows]) if ci_workflows else "No CI workflows af    # React Flow specific formats
    nodes = []
    edges = []
    
    # Extract changed node IDs to verify styles
    changed_nodes_set = set()
    for change in changes:
        for node in nx_graph.nodes:
            if change.get("symbol") in node or change.get("file") in node:
                changed_nodes_set.add(node)
                
    for node, data in nx_graph.nodes(data=True):
        # Set styling/status flags if impacted
        status = "normal"
        if node in changed_nodes_set:
            status = "changed"
        elif node in impacted:
            status = "impacted"
            
        nodes.append({
            "id": node,
            "type": data.get("type", "FILE"),
            "status": status,
            "data": {
                "label": data.get("label", node),
                "path": data.get("path", ""),
                "impact": impacted[node] if node in impacted else None
            }
        })
        
    for u, v, data in nx_graph.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "label": data.get("relationship", ""),
            "highlighted": u in impacted or v in impacted or u in changed_nodes_set
        })

    # Count real unique modules by extracting directories
    unique_modules = set()
    for f in scanned.get("files", []):
        parts = f.split("/")
        if len(parts) > 1:
            unique_modules.add(parts[0])

    return {
        "change": primary_change,
        "risk": risk,
        "summary": {
            "files": len(files_affected),
            "modules": len(unique_modules) if unique_modules else 1,
            "services": len(services_affected),
            "apis": len(apis_affected),
            "tests": len(tests),
            "teams": len(teams),
            "ciWorkflows": len(ci_workflows)
        },
        "graph": {
            "nodes": nodes,
            "edges": edges
        },
        "impacts": [
            {
                "name": data["label"],
                "type": data["type"],
                "impact": data["impact"],
                "reason": data["reason"],
                "path": data["path"]
            }
            for data in impacted.values()
        ],
        "tests": tests,
        "teams": teams,
        "ci": ci_workflows,
        "aiAnalysis": ai_reasoning,
        "prComment": pr_comment
    }
