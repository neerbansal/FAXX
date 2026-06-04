import unittest
from backend_server import redact_secrets

class TestRedactSecrets(unittest.TestCase):
    def test_redact_api_key(self):
        text = 'Here is my api_key: "abcdef1234567890abcdef"'
        expected = 'Here is my [REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

    def test_redact_token(self):
        text = 'Authorization: token="abcdef1234567890abcdef"'
        expected = 'Authorization: [REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

    def test_redact_password(self):
        text = 'password="mysecretpassword"'
        expected = '[REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

    def test_redact_nvapi(self):
        text = 'Using nvapi-1234567890abcdef'
        expected = 'Using [REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

    def test_redact_sk(self):
        text = 'My openai key is sk-1234567890abcdef'
        expected = 'My openai key is [REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

    def test_empty_string(self):
        self.assertEqual(redact_secrets(""), "")

    def test_no_secrets(self):
        text = "Just a normal string without any secrets."
        self.assertEqual(redact_secrets(text), text)

    def test_multiple_secrets(self):
        text = 'api_key="12345678901234567890" and password="foo"'
        expected = '[REDACTED] and [REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

    def test_case_insensitivity(self):
        text = 'API_KEY="12345678901234567890" and Password="foo"'
        expected = '[REDACTED] and [REDACTED]'
        self.assertEqual(redact_secrets(text), expected)

if __name__ == '__main__':
    unittest.main()
