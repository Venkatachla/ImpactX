import os
import re

IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', 'target', 'coverage', '.idea', '.vscode', 'vendor'}
SUPPORTED_EXTENSIONS = {'.java', '.js', '.jsx', '.ts', '.tsx', '.py'}

def scan_repository(repo_path: str):
    """
    Walks the repository directory, ignores irrelevant directories,
    and returns a catalog of files, configurations, CI workflows, and CODEOWNERS.
    """
    result = {
        "files": [],
        "tests": [],
        "workflows": [],
        "codeowners_path": None,
        "metadata": {
            "total_files": 0,
            "languages": {}
        }
    }
    
    if not os.path.exists(repo_path):
        return result
        
    for root, dirs, files in os.walk(repo_path):
        # In-place modify dirs to ignore folders recursively
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, repo_path).replace("\\", "/")
            
            # Check for workflows
            if ".github/workflows" in rel_path and file.endswith(('.yml', '.yaml')):
                result["workflows"].append(rel_path)
                continue
                
            # Check for CODEOWNERS
            if file == "CODEOWNERS" and (".github" in rel_path or rel_path == "CODEOWNERS"):
                result["codeowners_path"] = full_path
                continue
                
            _, ext = os.path.splitext(file)
            if ext in SUPPORTED_EXTENSIONS:
                result["files"].append(rel_path)
                result["metadata"]["total_files"] += 1
                result["metadata"]["languages"][ext] = result["metadata"]["languages"].get(ext, 0) + 1
                
                # Simple naming heuristic for tests
                if "test" in file.lower() or file.endswith(('Test.java', '.test.ts', '.test.tsx', '.test.js', '.spec.ts', '.spec.tsx')):
                    result["tests"].append(rel_path)
                    
    return result
