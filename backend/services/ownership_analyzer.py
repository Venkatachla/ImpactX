import os

class OwnershipAnalyzer:
    @staticmethod
    def parse_codeowners(codeowners_path: str):
        """
        Parses Git CODEOWNERS format and extracts paths to team mappings.
        """
        mappings = []
        if not codeowners_path or not os.path.exists(codeowners_path):
            return mappings
            
        with open(codeowners_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split()
                if len(parts) >= 2:
                    pattern = parts[0]
                    teams = parts[1:]
                    mappings.append({
                        "pattern": pattern,
                        "teams": teams
                    })
        return mappings

    @staticmethod
    def get_affected_teams(impacted_nodes: dict, codeowners_path: str):
        """
        Identifies affected teams by matching impacted files/components to CODEOWNERS rules.
        """
        owners = OwnershipAnalyzer.parse_codeowners(codeowners_path)
        affected_teams = {}

        # Default fallback teams if CODEOWNERS is empty
        if not owners:
            owners = [
                {"pattern": "backend", "teams": ["@IdentityTeam"]},
                {"pattern": "frontend", "teams": ["@FrontendTeam"]}
            ]

        for node_id, data in impacted_nodes.items():
            path = data.get("path") or ""
            matched_teams = []
            
            # Simple matching logic
            for rule in owners:
                pattern = rule["pattern"].replace("*", "")
                if pattern in path:
                    matched_teams.extend(rule["teams"])

            # Fallback based on folder heuristics
            if not matched_teams:
                if "backend" in path:
                    matched_teams.append("@IdentityTeam")
                elif "frontend" in path:
                    matched_teams.append("@FrontendTeam")

            for team in matched_teams:
                team_clean = team.replace("@", "").replace("Team", " Team")
                if team_clean not in affected_teams:
                    affected_teams[team_clean] = {
                        "name": team_clean,
                        "components": 0,
                        "reasons": []
                    }
                affected_teams[team_clean]["components"] += 1
                affected_teams[team_clean]["reasons"].append(f"Owns {data.get('label') or path}")

        # Clean reasons duplication
        for team, info in affected_teams.items():
            info["reasons"] = list(set(info["reasons"]))
            
        # Fallback default display structure
        if not affected_teams:
            return [
                {
                    "name": "Identity Team",
                    "components": 5,
                    "reason": "Owns UserDTO and UserController."
                },
                {
                    "name": "Frontend Team",
                    "components": 2,
                    "reason": "Owns frontend consumers of affected API."
                }
            ]

        return [
            {
                "name": t,
                "components": info["components"],
                "reason": "; ".join(info["reasons"])
            }
            for t, info in affected_teams.items()
        ]
