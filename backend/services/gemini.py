import os
import json
from google import genai
from google.genai import types

class GeminiService:
    @staticmethod
    def get_ai_reasoning(change: dict, path: list):
        """
        Calls Gemini to explain likely failure, remediation, and migration strategies.
        Requires GEMINI_API_KEY environment variable.
        If API key is missing or call fails, returns a fallback clean deterministic explanation.
        """
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return GeminiService.get_fallback_reasoning(change, path)
            
        try:
            client = genai.Client(api_key=api_key)
            prompt = f"""
            You are a senior software architect. Analyze this code change and dependency path:
            Change: {json.dumps(change)}
            Dependency Path: {" -> ".join(path)}
            
            Provide a structured JSON output with the following fields:
            - failureExplanation: Explanation of how this change causes a runtime failure.
            - remediation: Recommended fix for the frontend/backend to work correctly.
            - migrationAdvice: Step-by-step transition plan (e.g. serialization alias, transition period).
            - suggestedtest: Specific regression test logic/assertion to add.
            """
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )
            
            if response.text:
                return json.loads(response.text)
        except Exception:
            pass
            
        return GeminiService.get_fallback_reasoning(change, path)

    @staticmethod
    def get_fallback_reasoning(change: dict, path: list):
        # Generate explanations dynamically from the actual change context
        file_name = change.get("file", "unknown file")
        symbol = change.get("symbol", "unknown symbol")
        change_type = change.get("changeType", "GENERIC_CHANGE")
        
        path_str = " -> ".join(path) if path else "N/A"
        
        return {
            "failureExplanation": f"The change of type {change_type} on symbol '{symbol}' inside file '{file_name}' propagates down the dependency path: {path_str}. Downstream consumers may experience type mismatches or unhandled exceptions.",
            "remediation": f"Verify all references to '{symbol}' in dependent modules are updated to match the new declaration.",
            "migrationAdvice": "Use deprecated annotations or serializable compatibility layers during transition periods.",
            "suggestedTest": f"Add regression/integration tests verifying that downstream consumers of '{symbol}' behave correctly."
        }
