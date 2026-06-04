import pytest
from backend_server import app, CREDITS

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_credits_known_model(client):
    response = client.get('/api/credits/glm')
    assert response.status_code == 200
    data = response.get_json()
    assert 'model' in data
    assert data['model'] == 'glm'
    assert 'remaining' in data

def test_get_credits_unknown_model(client):
    response = client.get('/api/credits/unknown_model_123')
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Unknown model'

def test_get_all_credits(client):
    response = client.get('/api/credits')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert 'glm' in data
    assert 'minimax' in data
