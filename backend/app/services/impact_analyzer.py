from app.schemas.impact import ImpactResponse, AffectedItem
from app.services.repo_store import repo_store
from app.services.graph_builder import GraphBuilderService


class ImpactAnalyzerService:
    """
    Computes real direct dependencies, reverse dependencies,
    and blast radius metrics for a symbol or file within a repository.
    """

    @classmethod
    def analyze_symbol_impact(cls, repo_id: str, symbol_id: str) -> ImpactResponse:
        symbols = repo_store.get_symbols(repo_id)
        files = repo_store.get_files(repo_id)
        imports_map = repo_store.get_imports_map(repo_id)

        target_sym = next((s for s in symbols if s["id"] == symbol_id), None)
        if not target_sym and symbols:
            target_sym = symbols[0]

        if not target_sym:
            return ImpactResponse(
                symbol_id=symbol_id,
                target_name="No symbols indexed",
                target_type="module",
                target_path="N/A",
                direct_dependencies=[],
                reverse_dependencies=[],
                blast_radius_score=0,
                affected_files_count=0,
                summary="No parsed symbols were found in this repository to analyze.",
                graph={"nodes": [], "edges": []},
            )

        target_name = target_sym["name"]
        target_path = target_sym["file_path"]
        target_type = target_sym["symbol_type"]

        # 1. Direct dependencies: modules/files imported by target_path
        direct_deps = []
        for idx, imp in enumerate(imports_map.get(target_path, [])):
            resolved = GraphBuilderService._resolve_import_target(imp, files)
            direct_deps.append(
                AffectedItem(
                    id=f"dep-{idx + 1}",
                    name=imp,
                    type="module" if resolved else "external",
                    path=resolved["path"] if resolved else "external/stdlib",
                    reason=f"Imported directly by {target_path}",
                    impact_level="medium" if resolved else "low",
                )
            )

        # 2. Reverse dependencies: files that import target_path OR reference target_name in their code
        reverse_deps = []
        seen_paths = set()

        for f in files:
            fpath = f["path"]
            if fpath == target_path:
                continue

            # Check import resolution
            imports_target = False
            for imp in imports_map.get(fpath, []):
                resolved = GraphBuilderService._resolve_import_target(imp, files)
                if resolved and resolved["path"] == target_path:
                    imports_target = True
                    break

            # Check symbol name reference in source content
            content = f.get("content") or ""
            references_symbol = target_name in content and len(target_name) > 2

            if imports_target or references_symbol:
                seen_paths.add(fpath)
                level = "high" if (imports_target and references_symbol) else ("medium" if imports_target else "low")
                reason = (
                    f"Imports {target_path} and references '{target_name}'"
                    if (imports_target and references_symbol)
                    else (f"Imports {target_path}" if imports_target else f"References symbol '{target_name}'")
                )
                reverse_deps.append(
                    AffectedItem(
                        id=f"rev-{len(reverse_deps) + 1}",
                        name=f["name"],
                        type="file",
                        path=fpath,
                        reason=reason,
                        impact_level=level,
                    )
                )

        affected_count = len(seen_paths)
        total_files = max(len(files), 1)
        blast_score = min(98, int((affected_count / total_files) * 100) + (15 if affected_count > 0 else 0))

        risk_label = "HIGH" if blast_score >= 50 else ("MEDIUM" if blast_score >= 20 else "LOW")
        summary = (
            f"Modifying '{target_name}' in {target_path} carries a {risk_label} blast radius ({blast_score}%). "
            f"{affected_count} file(s) in this repository import {target_path} or reference '{target_name}'."
        )

        return ImpactResponse(
            symbol_id=target_sym["id"],
            target_name=target_name,
            target_type=target_type,
            target_path=target_path,
            direct_dependencies=direct_deps,
            reverse_dependencies=reverse_deps,
            blast_radius_score=blast_score,
            affected_files_count=affected_count,
            summary=summary,
            graph={
                "nodes": [{"id": "target", "label": target_name, "type": "target"}]
                + [{"id": r.id, "label": r.path, "type": r.impact_level} for r in reverse_deps],
                "edges": [{"source": "target", "target": r.id} for r in reverse_deps],
            },
        )
