import unittest
import json
import sys
import os

# Add the parent directory to the sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend_server import app

class AnalyzeCodeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_analyze_code_missing_code(self):
        response = self.app.post('/api/analyze', json={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data.get("error"), "No code provided")

    def test_analyze_code_empty_string_code(self):
        response = self.app.post('/api/analyze', json={"code": ""})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data.get("error"), "No code provided")

if __name__ == '__main__':
    unittest.main()
