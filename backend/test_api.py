import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing Code Archaeologist API Endpoints...")

    # Root & Health
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.status_code}"
    print("✓ GET / -> 200 OK")

    r = client.get("/health")
    assert r.status_code == 200, f"Health failed: {r.status_code}"
    print("✓ GET /health -> 200 OK")

    # Repositories
    r = client.get("/api/repositories")
    assert r.status_code == 200, f"List repos failed: {r.status_code}"
    repos = r.json()
    assert len(repos) >= 3
    print(f"✓ GET /api/repositories -> 200 OK ({len(repos)} repositories found)")

    repo_id = repos[0]["id"]
    r = client.get(f"/api/repositories/{repo_id}")
    assert r.status_code == 200
    print(f"✓ GET /api/repositories/{repo_id} -> 200 OK")

    # Files
    r = client.get(f"/api/repositories/{repo_id}/files")
    assert r.status_code == 200
    files = r.json()
    assert len(files) > 0
    print(f"✓ GET /api/repositories/{repo_id}/files -> 200 OK ({len(files)} files)")

    # File Content
    r = client.get(f"/api/repositories/{repo_id}/files/content?path=src/services/auth.ts")
    assert r.status_code == 200
    file_content = r.json()
    assert "AuthService" in file_content["content"]
    print("✓ GET /api/repositories/{id}/files/content -> 200 OK (AST content retrieved)")

    # Symbols
    r = client.get(f"/api/repositories/{repo_id}/symbols")
    assert r.status_code == 200
    symbols = r.json()
    assert len(symbols) > 0
    print(f"✓ GET /api/repositories/{repo_id}/symbols -> 200 OK ({len(symbols)} symbols)")

    # Architecture Graph
    r = client.get(f"/api/repositories/{repo_id}/graph")
    assert r.status_code == 200
    graph = r.json()
    assert len(graph["nodes"]) > 0
    assert len(graph["edges"]) > 0
    print(f"✓ GET /api/repositories/{repo_id}/graph -> 200 OK ({len(graph['nodes'])} nodes, {len(graph['edges'])} edges)")

    # Dependencies
    r = client.get(f"/api/repositories/{repo_id}/dependencies")
    assert r.status_code == 200
    print("✓ GET /api/repositories/{id}/dependencies -> 200 OK")

    # Ask Gemini / Codebase Intelligence
    r = client.post(f"/api/repositories/{repo_id}/ask", json={"query": "How does authentication work?"})
    assert r.status_code == 200
    answer = r.json()
    assert len(answer["answer"]) > 10
    assert len(answer["citations"]) > 0
    print(f"✓ POST /api/repositories/{repo_id}/ask -> 200 OK (Grounded citations: {len(answer['citations'])})")

    # Impact Analysis
    r = client.get(f"/api/repositories/{repo_id}/impact/sym-2")
    assert r.status_code == 200
    impact = r.json()
    assert impact["blast_radius_score"] > 0
    print(f"✓ GET /api/repositories/{repo_id}/impact/sym-2 -> 200 OK (Blast radius: {impact['blast_radius_score']}%)")

    # GitHub Ingestion Endpoint
    r = client.post("/api/repositories/github", json={"repo_url": "https://github.com/fastapi/fastapi", "branch": "master"})
    assert r.status_code == 201
    print("✓ POST /api/repositories/github -> 201 Created")

    print("\nALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
