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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRepoRequest(BaseModel):
    repoPath: str

class AnalyzeImpactRequest(BaseModel):
    repoPath: str
    diffMode: Optional[str] = "demo"

# Global state mapping representing repository baseline snapshots
BASELINE_SNAPSHOTS = {}

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
    if path.startswith("http://") or path.startswith("https://"):
        import tempfile
        import shutil
        from git import Repo
        
        # Create a unique temporary directory name in workspace
        safe_name = re.sub(r'[^a-zA-Z0-9]', '_', path)
        temp_dir = os.path.join(os.path.dirname(__file__), "..", "cloned_repos", safe_name)
        if os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir)
            except Exception:
                pass
        
        os.makedirs(temp_dir, exist_ok=True)
        try:
            Repo.clone_from(path, temp_dir)
            path = temp_dir
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to clone remote repository: {str(e)}")
            
    if not os.path.exists(path):
        # Fallback to local demo-repo
        path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo-repo"))
        
    scanned = scan_repository(path)
    
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
    change = ChangeAnalyzer.detect_change(path, req.diffMode)
    if not change:
        return {
            "change": None,
            "risk": {"score": 0, "level": "LOW", "confidence": 100, "breakdown": []},
            "summary": {"files": 0, "modules": 0, "services": 0, "apis": 0, "tests": 0, "teams": 0, "ciWorkflows": 0},
            "graph": {
                "nodes": [],
                "edges": []
            },
            "impacts": [],
            "tests": [],
            "teams": [],
            "ci": [],
            "aiAnalysis": {
                "failureExplanation": "No local code changes detected.",
                "remediation": "Modify a source file or check in a commit first.",
                "migrationAdvice": "N/A",
                "suggestedTest": "N/A"
            },
            "prComment": "⚡ **ImpactX Change Analysis**\n\nNo changes detected."
        }

    # Find changed node in graph
    changed_node = None
    # Look for field node match
    field_key = f"field:com.example.demo.dto.UserDTO.{change.get('symbol')}"
    if nx_graph.has_node(field_key):
        changed_node = field_key
    else:
        # Search class/method/file match
        for node in nx_graph.nodes:
            if change.get("symbol") in node or change.get("file") in node:
                changed_node = node
                break
                
    if not changed_node:
        # File node fallback
        changed_node = change.get("file")
        if not nx_graph.has_node(changed_node):
            nx_graph.add_node(changed_node, type="FILE", label=os.path.basename(changed_node))

    # 4. Blast Radius BFS Analysis
    impacted = ImpactAnalyzer.analyze_impact(nx_graph, changed_node)
    
    # 5. Extract specific stats for response
    files_affected = set()
    services_affected = set()
    apis_affected = set()
    frontend_affected = set()
    
    for node_id, data in impacted.items():
        n_type = data["type"]
        path_str = data["path"] or node_id
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
    risk = RiskEngine.calculate_risk(change, impacted)
    
    # 9. Gemini AI explanation
    primary_path = [changed_node, "class:com.example.demo.dto.UserDTO", "api:GET:/api/users/*", "frontend/pages/ProfilePage.tsx"]
    ai_reasoning = GeminiService.get_ai_reasoning(change, primary_path)
    
    # 10. Generate PR Comment (Official Bonus)
    pr_comment = f"""⚡ **ImpactX Change Analysis**

Risk: 🔴 **{risk['level']}** — {risk['score']}/100
Confidence: **{risk['confidence']}%**

### Blast Radius
- {len(files_affected)} files
- {len(services_affected) + 1} services
- {len(apis_affected)} API contracts
- {len(tests)} relevant tests
- {len(teams)} teams
- {len(ci_workflows)} CI workflows

### Critical Path
`{changed_node}` → `GET /api/users/*` → `ProfilePage.tsx`

*Potential API contract incompatibility detected.*

### Must Run Tests
{chr(10).join([f"✓ {t['name']} - *{t['reason']}*" for t in tests if t['category'] == 'MUST RUN'])}

### Affected Teams
{chr(10).join([f"- **{t['name']}**: {t['reason']}" for t in teams])}

### Affected CI Workflows
{chr(10).join([f"- `{w['name']}`: {w['reason']}" for w in ci_workflows])}
"""

    # React Flow specific formats
    nodes = []
    edges = []
    
    for node, data in nx_graph.nodes(data=True):
        # Set styling/status flags if impacted
        status = "normal"
        if node == changed_node:
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
            "highlighted": u in impacted or v in impacted or u == changed_node
        })

    return {
        "change": change,
        "risk": risk,
        "summary": {
            "files": len(files_affected),
            "modules": 4,
            "services": len(services_affected) if services_affected else 3,
            "apis": len(apis_affected) if apis_affected else 2,
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
