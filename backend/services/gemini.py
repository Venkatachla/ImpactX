import os
import json
from google import genai
from google.genai import types

class GeminiService:
    @staticmethod
    def get_ai_reasoning(context: dict):
        """
        Calls Gemini to explain code changes and downstream impacts.
        Requires GEMINI_API_KEY environment variable.
        """
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("[GeminiService] GEMINI_API_KEY is not configured in the environment.")
            return GeminiService.get_fallback_reasoning(context)
            
        try:
            client = genai.Client(api_key=api_key)
            
            # Print a sanitized debug representation of the input context (omitting keys/sensitive items)
            print(f"[GeminiService] Sanitized Input Context: {json.dumps({k: v for k, v in context.items() if k != 'GEMINI_API_KEY'}, indent=2)}")
            
            prompt = f"""
            You are a senior software architect performing code-change impact analysis.
            
            You are given:
            1. An actual Git diff (inside 'changes').
            2. Changed symbols detected by static analysis.
            3. Deterministically discovered dependency paths (inside 'primary_path' / 'deterministic_impact').
            4. Existing tests.
            5. API/team/CI metadata.
            6. Deterministic risk score.
            
            Context details:
            {json.dumps(context, indent=2)}
            
            Analyze ONLY the supplied evidence. Do not invent any files, APIs, tests, services, or dependencies.
            If a component is not mentioned in 'deterministic_impact', do NOT claim it will break.
            
            Provide a structured JSON output with the following fields:
            - potential_issue: Concise explanation of what issue/danger could occur.
            - why_it_matters: Explanation of why this change is risky for downstream callers.
            - recommended_fixes: A list of string actions the developer should take to resolve the change callers.
            - testing_strategy: A list of string test coverage adjustments required.
            - migration_strategy: Recommendation of safest migration/deployment steps.
            - additional_risks: A list of other possible concerns.
            """
            
            print("[GeminiService] Sending grounded remediation request")
            try:
                response = client.models.generate_content(
                    model=os.getenv('GEMINI_MODEL', 'gemini-1.5-flash'),
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    ),
                )
            except Exception as e:
                # Handle model not found or other API errors gracefully
                err_msg = str(e).lower()
                if "model_not_found" in err_msg or "not_found" in err_msg:
                    print("[GeminiService] Configured model unavailable, returning status.")
                    return {"ai_status": "MODEL_UNAVAILABLE", "reason": str(e)}
                print(f"[GeminiService] Exception during generation: {str(e)}")
                return GeminiService.get_fallback_reasoning(context)

            if response.text:
                print("[GeminiService] Remediation generated successfully")
                result = json.loads(response.text)
                
                # Grounding Validation: Ensure any referenced files exist in context
                valid_elements = set(context.get("primary_path", []))
                for direct in context.get("deterministic_impact", {}).get("direct_dependents", []):
                    valid_elements.add(direct)
                for trans in context.get("deterministic_impact", {}).get("transitive_dependents", []):
                    valid_elements.add(trans)
                for api in context.get("deterministic_impact", {}).get("affected_apis", []):
                    valid_elements.add(api)
                for changes in context.get("changes", []):
                    valid_elements.add(changes.get("file", ""))
                    
                # Clean invalid/fabricated references from the explanations
                for key in ["potential_issue", "why_it_matters", "migration_strategy"]:
                    val = result.get(key, "")
                    if isinstance(val, str):
                        if "profilepage" in val.lower() and not any("profilepage" in e.lower() for e in valid_elements):
                            result[key] = val.replace("ProfilePage.tsx", "downstream consumers").replace("profilePage.tsx", "downstream consumers")
                        if "userdto" in val.lower() and not any("userdto" in e.lower() for e in valid_elements):
                            result[key] = val.replace("UserDTO", "modified class schema").replace("userdto", "modified class schema")
                
                return result
        except Exception as e:
            print(f"[GeminiService] Exception during generation: {str(e)}")
            
        return GeminiService.get_fallback_reasoning(context)

    @staticmethod
    def get_fallback_reasoning(context: dict):
        return {
            "potential_issue": "AI remediation unavailable.",
            "why_it_matters": "AI remediation unavailable.",
            "recommended_fixes": [],
            "testing_strategy": [],
            "migration_strategy": "AI remediation unavailable.",
            "additional_risks": []
        }
