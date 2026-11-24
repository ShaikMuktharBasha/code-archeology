from typing import List, Dict, Any
from app.schemas.impact import ImpactResponse, AffectedItem

class ImpactAnalyzerService:
    """
    Computes direct dependencies, reverse dependencies,
    and blast radius metrics when a file or symbol is modified.
    """

    @classmethod
    def analyze_symbol_impact(cls, repo_id: str, symbol_id: str) -> ImpactResponse:
        """
        Calculates the blast radius of modifying a specific symbol or component.
        """
        # Realistic sample analysis for demonstrative blast radius
        return ImpactResponse(
            symbol_id=symbol_id,
            target_name="AuthService.validateToken",
            target_type="function",
            target_path="src/services/auth.ts",
            blast_radius_score=68,
            affected_files_count=4,
            summary=(
                "Modifying 'AuthService.validateToken' has a HIGH impact across the application. "
                "4 downstream services and routes directly consume this method for session and permission verification. "
                "Any contract or return signature change requires updating caller middleware."
            ),
            direct_dependencies=[
                AffectedItem(
                    id="dep-1",
                    name="jsonwebtoken",
                    type="library",
                    path="package.json",
                    reason="Direct token signature verification library",
                    impact_level="low"
                ),
                AffectedItem(
                    id="dep-2",
                    name="SessionModel",
                    type="class",
                    path="src/models/session.ts",
                    reason="Stores active token identifiers and revocations",
                    impact_level="medium"
                )
            ],
            reverse_dependencies=[
                AffectedItem(
                    id="rev-1",
                    name="authMiddleware",
                    type="function",
                    path="src/api/router.ts",
                    reason="Executes validateToken on every protected API endpoint",
                    impact_level="high"
                ),
                AffectedItem(
                    id="rev-2",
                    name="RepositoryAccessGuard",
                    type="class",
                    path="src/services/security.ts",
                    reason="Verifies repository ownership based on user claims",
                    impact_level="high"
                ),
                AffectedItem(
                    id="rev-3",
                    name="WebSocketAuthHandler",
                    type="function",
                    path="src/realtime/socket.ts",
                    reason="Authenticates streaming graph subscriptions",
                    impact_level="medium"
                ),
                AffectedItem(
                    id="rev-4",
                    name="UserContextHook",
                    type="function",
                    path="src/frontend/hooks/useUser.ts",
                    reason="Consumes decoded token payload contract",
                    impact_level="medium"
                )
            ],
            graph={
                "nodes": [
                    {"id": "target", "label": "AuthService.validateToken", "type": "target"},
                    {"id": "router", "label": "src/api/router.ts", "type": "high"},
                    {"id": "security", "label": "src/services/security.ts", "type": "high"},
                    {"id": "socket", "label": "src/realtime/socket.ts", "type": "medium"},
                    {"id": "ui", "label": "src/frontend/hooks/useUser.ts", "type": "medium"},
                ],
                "edges": [
                    {"source": "target", "target": "router"},
                    {"source": "target", "target": "security"},
                    {"source": "target", "target": "socket"},
                    {"source": "target", "target": "ui"},
                ]
            }
        )
