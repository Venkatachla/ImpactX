class ApiAnalyzer:
    @staticmethod
    def map_apis(backend_apis: list, frontend_calls: list):
        """
        Maps backend rest endpoints to frontend api consumption calls.
        Normalizes both sides to match routes (e.g. /api/users/{id} and /api/users/${id} to /api/users/*)
        """
        mappings = []
        for b_api in backend_apis:
            b_norm = b_api.get("normalizedRoute")
            for f_call in frontend_calls:
                f_norm = f_call.get("normalizedUrl")
                if b_norm == f_norm and b_api.get("method") == f_call.get("method"):
                    mappings.append({
                        "api": b_api,
                        "frontend_call": f_call,
                        "normalizedRoute": b_norm
                    })
        return mappings
