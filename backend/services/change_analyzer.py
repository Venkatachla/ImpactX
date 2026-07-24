import os
import re
from git import Repo

class ChangeAnalyzer:
    @staticmethod
    def detect_change(repo_path: str, diff_mode: str = "demo"):
        """
        Analyzes the change in the repo.
        Supports:
        - diff_mode = "git" (runs git diff)
        - diff_mode = "git-commit" (compares HEAD~1 to HEAD)
        - diff_mode = "demo" (golden fallback DTO field rename scenario)
        """
        if diff_mode == "demo":
            return {
                "file": "backend/dto/UserDTO.java",
                "symbol": "email",
                "changeType": "FIELD_RENAMED",
                "oldValue": "email",
                "newValue": "primaryEmail",
                "lines": [8, 9]
            }
            
        try:
            repo = Repo(repo_path)
            diffs = []
            
            if diff_mode == "git-commit":
                commits = list(repo.iter_commits(max_count=1))
                if commits and commits[0].parents:
                    diffs = commits[0].parents[0].diff(commits[0], create_patch=True)
            else:
                # git working tree changes
                diffs = repo.index.diff(None, create_patch=True) + repo.index.diff('HEAD', create_patch=True)
            
            for diff in diffs:
                path = diff.b_path or diff.a_path
                if not path:
                    continue
                path_clean = path.replace("\\", "/")
                
                if path_clean.endswith((".java", ".ts", ".tsx", ".js", ".py")):
                    diff_text = diff.diff.decode('utf-8', errors='ignore') if isinstance(diff.diff, bytes) else str(diff.diff)
                    
                    # Look for field/variable renames
                    rename_match = re.search(r'-(\s*\w+)\s*;\s*\n\+(\s*\w+)\s*;', diff_text)
                    if rename_match:
                        return {
                            "file": path_clean,
                            "symbol": rename_match.group(1).strip(),
                            "changeType": "FIELD_RENAMED",
                            "oldValue": rename_match.group(1).strip(),
                            "newValue": rename_match.group(2).strip(),
                            "lines": [1, 10]
                        }
                    
                    return {
                        "file": path_clean,
                        "symbol": os.path.basename(path_clean),
                        "changeType": "GENERIC_FILE_CHANGE",
                        "oldValue": "original",
                        "newValue": "modified",
                        "lines": [1, 5]
                    }
        except Exception:
            pass
            
        return None
