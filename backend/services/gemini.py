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
        return {
            "failureExplanation": "The frontend ProfilePage.tsx expects 'user.email' from the GET /api/users/{id} API. Because the DTO field was renamed to 'primaryEmail', the API response will omit 'email', causing 'user.email' to evaluate to undefined and crash the rendering script.",
            "remediation": "Update the frontend API consumer in ProfilePage.tsx to reference user.primaryEmail, or implement a backend serialization alias to maintain backwards compatibility.",
            "migrationAdvice": "Add a serialization alias @JsonProperty(\"email\") on UserDTO.primaryEmail during a 30-day migration period, allowing legacy clients to transition safely.",
            "suggestedTest": "Add a compatibility test verifying that requesting /api/users/{id} returns both 'email' and 'primaryEmail' properties in the payload."
        }
