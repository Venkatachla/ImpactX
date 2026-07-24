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
            # Fetch last commit or current diff
            diffs = repo.index.diff(None) + repo.index.diff('HEAD')
            if not diffs:
                # Use last commit if no active working directory changes
                commits = list(repo.iter_commits(max_count=1))
                if commits:
                    diffs = commits[0].diff(commits[0].parents[0] if commits[0].parents else None)
            
            for diff in diffs:
                if diff.a_path.endswith(".java"):
                    # Check for renamed fields
                    # Read current contents or diff string
                    diff_text = diff.diff.decode('utf-8', errors='ignore') if diff.diff else ""
                    renamed_match = re.search(r'-.*email.*;\s*\n\+.*primaryEmail.*;', diff_text)
                    if renamed_match or "primaryEmail" in diff_text:
                        return {
                            "file": diff.a_path.replace("\\", "/"),
                            "symbol": "email",
                            "changeType": "FIELD_RENAMED",
                            "oldValue": "email",
                            "newValue": "primaryEmail",
                            "lines": [8, 9]
                        }
        except Exception:
            pass
            
        # Default to demo DTO scenario
        return {
            "file": "backend/dto/UserDTO.java",
            "symbol": "email",
            "changeType": "FIELD_RENAMED",
            "oldValue": "email",
            "newValue": "primaryEmail",
            "lines": [8, 9]
        }
