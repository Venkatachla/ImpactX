import networkx as nx

class ImpactAnalyzer:
    @staticmethod
    def analyze_impact(graph: nx.DiGraph, changed_node_id: str, max_depth: int = 4):
        """
        Traverses the dependency graph in reverse direction (parents/dependents)
        to identify the blast radius of a changed node.
        Returns direct, transitive impacts, depths, and evidence paths.
        """
        impacted_nodes = {}
        
        if not graph.has_node(changed_node_id):
            return impacted_nodes
            
        # NetworkX reverse traversal
        # We want to find nodes that depend on changed_node_id, i.e. v where v -> u (or u depends on v, so traversal is in reverse edge direction)
        # To do reverse search, we can use graph.predecessors() if edges go from Dependent -> Dependency
        # Or successors if edges go from Dependency -> Dependent.
        # In our graph design:
        # File contains Class, Class contains Method, Method calls method, UserController exposes API, ProfilePage consumes API.
        # So dependency flows:
        # DTO -> API (exposes/returns) -> React file (consumes)
        # Class -> Method -> contains
        # Dependent -> Dependency (e.g. UserService depends on UserRepository, so edge is UserService -> UserRepository)
        # Let's trace both successors and predecessors depending on context, or build a generalized reachability where target nodes depend on changed_node.
        
        # Let's define the traversal strategy:
        # For a DTO field change:
        # DTO class node: "class:com.example.demo.dto.UserDTO"
        # UserController depends on/uses UserDTO (or exposes API returning UserDTO).
        # We will traverse outgoing edges or incoming edges to find downstream dependents.
        # Let's implement a BFS that checks both incoming/outgoing dependent relationships.
        queue = [(changed_node_id, 0, [changed_node_id])]
        visited = {changed_node_id}
        
        while queue:
            current_node, depth, path = queue.pop(0)
            if depth > max_depth:
                continue
                
            if current_node != changed_node_id:
                node_data = graph.nodes[current_node]
                impacted_nodes[current_node] = {
                    "id": current_node,
                    "label": node_data.get("label", current_node),
                    "type": node_data.get("type"),
                    "depth": depth,
                    "impact": "DIRECT" if depth == 1 else "TRANSITIVE",
                    "path": path,
                    "reason": f"Impacted via path: {' -> '.join(path)}"
                }
                
            # Downstream search: nodes that point to us (predecessors in Dependency -> Dependent, or successors depending on how we added edges)
            # Let's collect all possible neighbors that represent dependents:
            neighbors = []
            
            # If current_node is DTO class:
            # - Controller class node points to API. API depends on DTO.
            # Let's look at all edges. In a general directed graph:
            # We want to traverse from Dependency to Dependent.
            # Let's trace in both directions but filter to make sure it's a dependent:
            # Outward edges:
            # Outward edges (Dependency -> Dependent, so successor is impacted):
            for successor in graph.successors(current_node):
                edge_data = graph.get_edge_data(current_node, successor)
                rel = edge_data.get("relationship")
                # Do NOT follow containment/defining relationships like CONTAINS or DEFINES.
                if rel in {"EXPOSES", "RETURNS", "CONSUMES", "IMPORTS", "DEPENDS_ON", "USES", "CALLS"}:
                    if successor not in visited:
                        neighbors.append(successor)
                        
            # Inward edges (Dependent -> Dependency, so predecessor is impacted):
            for predecessor in graph.predecessors(current_node):
                edge_data = graph.get_edge_data(predecessor, current_node)
                rel = edge_data.get("relationship")
                if rel in {"CALLS", "CONSUMES", "DEPENDS_ON", "USES"}:
                    if predecessor not in visited:
                        neighbors.append(predecessor)
                        
            for neighbor in neighbors:
                visited.add(neighbor)
                queue.append((neighbor, depth + 1, path + [neighbor]))
                
        return impacted_nodes
