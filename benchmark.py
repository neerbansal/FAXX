import time
import backend_server
from backend_server import app
from unittest.mock import patch

# Setup
backend_server.YOUTUBE_API_KEY = "mock_key"

def run_benchmark():
    with app.test_client() as client:
        with patch('backend_server.requests.get') as mock_get:
            mock_get.return_value.json.return_value = {"mock": "data"}

            def side_effect(*args, **kwargs):
                time.sleep(0.05) # 50ms latency
                return mock_get.return_value
            mock_get.side_effect = side_effect

            start = time.time()
            for _ in range(100):
                response = client.get('/api/youtube/stats?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA')
                assert response.status_code == 200
            end = time.time()
            print(f"Time taken for 100 requests: {end - start:.4f} seconds")

if __name__ == "__main__":
    run_benchmark()
