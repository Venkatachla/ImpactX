import os
import re
import networkx as nx

class DependencyGraph:
    def __init__(self):
        self.graph = nx.DiGraph()

    def build_graph(self, repo_path: str, scanned_data: dict, parsed_data: dict):
        """
        Builds a NetworkX directed graph containing all code entities and relationships.
        """
        # 1. Add File nodes
        for file_rel in scanned_data.get("files", []):
            self.graph.add_node(file_rel, type="FILE", label=os.path.basename(file_rel))

        # 2. Add classes, methods, fields, and APIs
        for file_rel, entities in parsed_data.items():
            # Add containing relationship
            for cls in entities.get("classes", []):
                cls_id = f"class:{cls['fullName']}"
                self.graph.add_node(cls_id, type="CLASS", label=cls["name"], path=file_rel)
                self.graph.add_edge(file_rel, cls_id, relationship="CONTAINS")
                
                # Class to DTO/Service classification
                if "DTO" in cls["name"]:
                    self.graph.nodes[cls_id]["subtype"] = "DTO"
                elif "Service" in cls["name"]:
                    self.graph.nodes[cls_id]["subtype"] = "SERVICE"
                elif "Controller" in cls["name"]:
                    self.graph.nodes[cls_id]["subtype"] = "CONTROLLER"
                elif "Repository" in cls["name"]:
                    self.graph.nodes[cls_id]["subtype"] = "REPOSITORY"

            for method in entities.get("methods", []):
                # Identify class containing this method
                parent_cls = None
                for cls in entities.get("classes", []):
                    # Simple heuristic: if method is in same file, associate with the first class found in it
                    parent_cls = cls["fullName"]
                    break
                
                method_id = f"method:{parent_cls or ''}.{method['name']}"
                self.graph.add_node(method_id, type="METHOD", label=method["name"], path=file_rel)
                if parent_cls:
                    self.graph.add_edge(f"class:{parent_cls}", method_id, relationship="CONTAINS")

            for field in entities.get("fields", []):
                parent_cls = None
                for cls in entities.get("classes", []):
                    parent_cls = cls["fullName"]
                    break
                field_id = f"field:{parent_cls or ''}.{field['name']}"
                self.graph.add_node(field_id, type="FIELD", label=field["name"], path=file_rel, field_type=field["type"])
                if parent_cls:
                    self.graph.add_edge(f"class:{parent_cls}", field_id, relationship="CONTAINS")

            for api in entities.get("apis", []):
                api_id = f"api:{api['method']}:{api['normalizedRoute']}"
                self.graph.add_node(api_id, type="API", label=f"{api['method']} {api['route']}", method=api["method"], route=api["route"], normalized_route=api["normalizedRoute"])
                
                # Connect controller class to API
                for cls in entities.get("classes", []):
                    self.graph.add_edge(f"class:{cls['fullName']}", api_id, relationship="EXPOSES")

        # 3. Add Frontend API Calls and Pages
        for file_rel, entities in parsed_data.items():
            if entities.get("type") == "JS_TS":
                for api_call in entities.get("api_calls", []):
                    api_id = f"api:{api_call['method']}:{api_call['normalizedUrl']}"
                    # Ensure API node exists even if not parsed from backend yet
                    if not self.graph.has_node(api_id):
                        self.graph.add_node(api_id, type="API", label=f"{api_call['method']} {api_call['rawUrl']}", method=api_call["method"], route=api_call["rawUrl"], normalized_route=api_call["normalizedUrl"])
                    self.graph.add_edge(file_rel, api_id, relationship="CONSUMES")

        # 4. Connect dependencies via imports/usages (Heuristics for Java/TS dependency resolution)
        for file_rel, entities in parsed_data.items():
            if entities.get("type") == "JAVA":
                # Connect classes used by imports or constructor injection
                for cls in entities.get("classes", []):
                    cls_id = f"class:{cls['fullName']}"
                    for imp in entities.get("imports", []):
                        # Match imported package/class to existing class nodes
                        target_cls_id = f"class:{imp}"
                        if self.graph.has_node(target_cls_id):
                            self.graph.add_edge(cls_id, target_cls_id, relationship="DEPENDS_ON")
                            
                    # Method calls or class reference heuristic inside file content
                    # If file imports another class, make method/field dependencies
                    # Let's add direct linkages based on class names
                    for other_file, other_entities in parsed_data.items():
                        if other_file == file_rel:
                            continue
                        for other_cls in other_entities.get("classes", []):
                            if other_cls["name"] in entities.get("imports", []):
                                self.graph.add_edge(cls_id, f"class:{other_cls['fullName']}", relationship="DEPENDS_ON")
            
            elif entities.get("type") == "JS_TS":
                # Connect frontend pages/components to api files
                for imp in entities.get("imports", []):
                    src_path = imp["source"]
                    # Try to resolve relative path
                    # Let's resolve simple imports like ../api/userApi
                    for other_file in scanned_data.get("files", []):
                        if src_path.replace("./", "").replace("../", "") in other_file:
                            self.graph.add_edge(file_rel, other_file, relationship="IMPORTS")
        # ---- Enhanced cross‑file Java dependencies (IMPORTS, USES, INSTANTIATES) ----
        # Map full class names -> node IDs
        all_class_ids = {
            cls['fullName']: f"class:{cls['fullName']}"
            for ents in parsed_data.values()
            for cls in ents.get("classes", [])
        }
        # Simple name -> full name map for heuristic matching
        simple_name_to_full = {
            cls['name']: cls['fullName']
            for ents in parsed_data.values()
            for cls in ents.get("classes", [])
        }
        for file_rel, entities in parsed_data.items():
            if entities.get("type") != "JAVA":
                continue
            # IMPORT edges
            for imp in entities.get("imports", []):
                if imp in all_class_ids:
                    if entities.get("classes"):
                        src_cls = f"class:{entities['classes'][0]['fullName']}"
                        self.graph.add_edge(src_cls, all_class_ids[imp], relationship="IMPORTS")
                else:
                    import_node = f"import:{imp}"
                    self.graph.add_node(import_node, type="IMPORT", label=imp)
                    if entities.get("classes"):
                        src_cls = f"class:{entities['classes'][0]['fullName']}"
                        self.graph.add_edge(src_cls, import_node, relationship="IMPORTS")
            # USAGE / INSTANTIATION detection
            abs_path = os.path.join(repo_path, file_rel)
            try:
                with open(abs_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            except Exception:
                content = ""
            for simple_name, full_name in simple_name_to_full.items():
                if any(c["name"] == simple_name for c in entities.get("classes", [])):
                    continue
                if re.search(rf"\\b{re.escape(simple_name)}\\b", content):
                    for cls in entities.get("classes", []):
                        src_id = f"class:{cls['fullName']}"
                        tgt_id = all_class_ids.get(full_name)
                        if tgt_id:
                            self.graph.add_edge(src_id, tgt_id, relationship="USES")
                    if re.search(rf"new\\s+{re.escape(simple_name)}\\s*\\(", content):
                        for cls in entities.get("classes", []):
                            src_id = f"class:{cls['fullName']}"
                            tgt_id = all_class_ids.get(full_name)
                            if tgt_id:
                                self.graph.add_edge(src_id, tgt_id, relationship="INSTANTIATES")
        # 5. Add tests relationships
        for test_file in scanned_data.get("tests", []):
            self.graph.add_node(test_file, type="TEST", label=os.path.basename(test_file))
            # Heuristic link: UserControllerTest.java -> UserController
            target_class_name = os.path.basename(test_file).replace("Test.java", "").replace(".test.ts", "").replace(".test.tsx", "")
            for node, attr in list(self.graph.nodes(data=True)):
                if attr.get("type") == "CLASS" and attr.get("label") == target_class_name:
                    self.graph.add_edge(test_file, node, relationship="TESTS")
                elif attr.get("type") == "FILE" and target_class_name in attr.get("label", ""):
                    self.graph.add_edge(test_file, node, relationship="TESTS")


