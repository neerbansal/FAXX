import unittest
from backend_server import redact_secrets

class TestRedactSecrets(unittest.TestCase):
    def test_no_secrets(self):
        text = "This is a normal log message without any secrets."
        self.assertEqual(redact_secrets(text), text)

    def test_api_key_redaction(self):
        # Must be 20+ chars
        secret_text = "Here is my api_key='12345678901234567890' in the log."
        self.assertEqual(redact_secrets(secret_text), "Here is my [REDACTED] in the log.")

        secret_text2 = 'api-key="abcdefghijklmnopqrstuvwxyz"'
        self.assertEqual(redact_secrets(secret_text2), '[REDACTED]')

        secret_text3 = 'API_KEY: 12345678901234567890'
        self.assertEqual(redact_secrets(secret_text3), '[REDACTED]')

    def test_short_api_key_ignored(self):
        # Less than 20 chars should not be redacted for api_key
        text = "Here is my api_key='short'"
        self.assertEqual(redact_secrets(text), text)

    def test_token_redaction(self):
        # Must be 20+ chars
        secret_text = "Bearer token=abcdefghijklmnopqrstuvwxyz"
        self.assertEqual(redact_secrets(secret_text), "Bearer [REDACTED]")

        secret_text2 = "TOKEN : '12345678901234567890'"
        self.assertEqual(redact_secrets(secret_text2), "[REDACTED]")

    def test_short_token_ignored(self):
        # Less than 20 chars should not be redacted for token
        text = "token=123"
        self.assertEqual(redact_secrets(text), text)

    def test_password_redaction(self):
        secret_text = 'User password="MySecretPassword123!" logged in.'
        self.assertEqual(redact_secrets(secret_text), 'User [REDACTED] logged in.')

        secret_text2 = "PASSWORD: secret"
        self.assertEqual(redact_secrets(secret_text2), "[REDACTED]")

    def test_nvapi_redaction(self):
        secret_text = "Using nvapi-12345ABCDE for requests."
        self.assertEqual(redact_secrets(secret_text), "Using [REDACTED] for requests.")

    def test_sk_redaction(self):
        secret_text = "OpenAI key sk-1234567890ABCDEF in use."
        self.assertEqual(redact_secrets(secret_text), "OpenAI key [REDACTED] in use.")

    def test_multiple_secrets(self):
        secret_text = 'api_key="12345678901234567890" and password="foo"'
        self.assertEqual(redact_secrets(secret_text), '[REDACTED] and [REDACTED]')

if __name__ == '__main__':
    unittest.main()
