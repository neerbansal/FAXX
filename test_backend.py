import pytest
from backend_server import app
import os

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_cors_headers(client):
    response = client.options(
        "/",
        headers={"Origin": "https://faxx.up.railway.app",
                 "Access-Control-Request-Method": "GET"}
    )
    assert response.headers.get("Access-Control-Allow-Origin") == "https://faxx.up.railway.app"

def test_cors_headers_invalid(client):
    response = client.options(
        "/",
        headers={"Origin": "http://evil.com",
                 "Access-Control-Request-Method": "GET"}
    )
    assert response.headers.get("Access-Control-Allow-Origin") != "http://evil.com"
