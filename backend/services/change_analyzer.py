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
            # Fetch active working directory changes or staged changes
            diffs = repo.index.diff(None) + repo.index.diff('HEAD')
            
            for diff in diffs:
                path = diff.a_path or diff.b_path
                if not path:
                    continue
                path_clean = path.replace("\\", "/")
                
                # Check java file changes
                if path_clean.endswith(".java") or path_clean.endswith(".ts") or path_clean.endswith(".tsx"):
                    diff_text = diff.diff.decode('utf-8', errors='ignore') if diff.diff else ""
                    
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
            
        # Return None if no real changes are detected
        return None
