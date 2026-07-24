import os
import re

class StructuralParser:
    @staticmethod
    def parse_java_file(file_content: str, rel_path: str):
        entities = {
            "classes": [],
            "methods": [],
            "fields": [],
            "apis": [],
            "imports": [],
            "type": "JAVA"
        }
        
        # Imports
        imports = re.findall(r'import\s+([\w\.]+);', file_content)
        entities["imports"] = imports
        
        # Package name
        package_match = re.search(r'package\s+([\w\.]+);', file_content)
        package_name = package_match.group(1) if package_match else ""

        # Classes
        class_matches = re.finditer(r'(?:public|private|protected|static|\s)*\s+(?:class|interface)\s+(\w+)', file_content)
        for match in class_matches:
            name = match.group(1)
            full_name = f"{package_name}.{name}" if package_name else name
            entities["classes"].append({
                "name": name,
                "fullName": full_name,
                "isInterface": "interface" in match.group(0),
                "path": rel_path
            })
            
        # Fields (simple Java property regex matching e.g., private String email;)
        field_matches = re.finditer(r'(?:private|protected|public)\s+([\w<>]+)\s+(\w+)\s*(?:=.*|;)', file_content)
        for match in field_matches:
            entities["fields"].append({
                "type": match.group(1),
                "name": match.group(2),
                "path": rel_path
            })
            
        # Methods
        method_matches = re.finditer(r'(?:public|private|protected|static|\s)+\s+([\w<>]+)\s+(\w+)\s*\(([^)]*)\)\s*\{', file_content)
        for match in method_matches:
            ret_type = match.group(1)
            name = match.group(2)
            args = match.group(3)
            # Filter out language keywords matched by simple regex
            if name not in {"if", "for", "while", "switch", "catch", "synchronized"}:
                entities["methods"].append({
                    "name": name,
                    "returnType": ret_type,
                    "arguments": args.strip(),
                    "path": rel_path
                })
                
        # Spring MVC APIs / Controllers
        if "@RestController" in file_content or "@Controller" in file_content:
            base_route = ""
            base_route_match = re.search(r'@RequestMapping\(\s*\"([^\"]+)\"\s*\)', file_content)
            if base_route_match:
                base_route = base_route_match.group(1)
                
            # Mapping annotations
            mappings = re.finditer(r'@(GetMapping|PostMapping|PutMapping|DeleteMapping)\(\s*\"([^\"]+)\"\s*\)\s*(?:public|private|protected|\s)*\s+([\w<>]+)\s+(\w+)', file_content)
            for m in mappings:
                method_type = m.group(1).replace("Mapping", "").upper()
                sub_route = m.group(2)
                full_route = f"{base_route}{sub_route}".replace("//", "/")
                # Normalize route parameter patterns like /{id} to /*
                normalized_route = re.sub(r'/\{[^/]+\}', '/*', full_route)
                entities["apis"].append({
                    "method": method_type,
                    "route": full_route,
                    "normalizedRoute": normalized_route,
                    "handlerMethod": m.group(4)
                })
                
        return entities

    @staticmethod
    def parse_js_ts_file(file_content: str, rel_path: str):
        entities = {
            "imports": [],
            "exports": [],
            "api_calls": [],
            "type": "JS_TS"
        }
        
        # Imports (ES6 style)
        import_matches = re.finditer(r'import\s+(?:([\w\s{},*]+)\s+from\s+)?[\'"]([^\'"]+)[\'"]', file_content)
        for m in import_matches:
            entities["imports"].append({
                "imported": m.group(1).strip() if m.group(1) else "*",
                "source": m.group(2)
            })
            
        # Exports
        export_matches = re.findall(r'export\s+(?:const|let|var|function|class|interface|type)\s+(\w+)', file_content)
        entities["exports"].extend(export_matches)
        
        # API Calls (axios/fetch patterns e.g. axios.get('/api/users/${id}'))
        api_matches = re.finditer(r'(axios|fetch)\.(get|post|put|delete)\(\s*[`\'"]([^\`\'"]+)[`\'"]', file_content, re.IGNORECASE)
        for m in api_matches:
            raw_url = m.group(3)
            # Normalize route parameter patterns like /${id} or /:id to /*
            norm_url = re.sub(r'/\$\{[^}]+\}', '/*', raw_url)
            norm_url = re.sub(r'/:[^/]+', '/*', norm_url)
            entities["api_calls"].append({
                "client": m.group(1),
                "method": m.group(2).upper(),
                "rawUrl": raw_url,
                "normalizedUrl": norm_url
            })
            
        return entities

    @classmethod
    def parse_file(cls, repo_path: str, rel_path: str):
        full_path = os.path.join(repo_path, rel_path)
        if not os.path.exists(full_path):
            return {}
            
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            
        _, ext = os.path.splitext(rel_path)
        if ext == ".java":
            return cls.parse_java_file(content, rel_path)
        elif ext in {".js", ".jsx", ".ts", ".tsx"}:
            return cls.parse_js_ts_file(content, rel_path)
        return {}
