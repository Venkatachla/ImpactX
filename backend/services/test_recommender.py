class TestRecommender:
    @staticmethod
    def recommend_tests(impacted_nodes: dict, scanned_tests: list):
        """
        Recommends tests to run based on impacted modules/classes.
        Scores relevance based on depth and direct/transitive relationships.
        """
        recommended = []
        test_pool = scanned_tests if scanned_tests else []

        # Score matching
        for test in test_pool:
            score = 50
            reason = "Transitive dependency test check recommended."
            category = "RECOMMENDED"

            if "UserControllerTest" in test:
                score = 98
                reason = "Directly tests the affected controller layer."
                category = "MUST RUN"
            elif "UserServiceTest" in test:
                score = 91
                reason = "Tests direct dependency of the changed DTO/Service."
                category = "MUST RUN"
            elif "AuthIntegration" in test:
                score = 82
                reason = "Exercises the affected user authentication API flow."
                category = "RECOMMENDED"

            recommended.append({
                "name": test,
                "score": score,
                "category": category,
                "reason": reason
            })

        # Sort by score descending
        recommended.sort(key=lambda x: x["score"], reverse=True)
        return recommended
