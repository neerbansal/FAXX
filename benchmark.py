import timeit
import re

SECRET_PATTERNS = [
    re.compile(r'api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?', flags=re.IGNORECASE),
    re.compile(r'token["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?', flags=re.IGNORECASE),
    re.compile(r'password["\']?\s*[:=]\s*["\']?[^"\' ]+["\']?', flags=re.IGNORECASE),
    re.compile(r'nvapi-[a-zA-Z0-9_-]+', flags=re.IGNORECASE),
    re.compile(r'sk-[a-zA-Z0-9]+', flags=re.IGNORECASE),
]

def redact_secrets_old(text: str) -> str:
    out = text
    for pat in SECRET_PATTERNS:
        out = pat.sub('[REDACTED]', out)
    return out

# New code
COMBINED_PATTERN = re.compile(
    '|'.join(f"(?:{pat.pattern})" for pat in SECRET_PATTERNS),
    flags=re.IGNORECASE
)

def redact_secrets_new(text: str) -> str:
    return COMBINED_PATTERN.sub('[REDACTED]', text)


test_string = """
Here is some text with some secrets.
api_key: "abc123DEF456ghi789jkl012mno"
password="supersecretpassword123"
token: abc123DEF456ghi789jkl012mno
nvapi-somethingsomething
sk-12345abcd
Normal text normal text normal text
api_key="12345" # not a secret
api-key: "12345678901234567890"
""" * 100

def test_old():
    redact_secrets_old(test_string)

def test_new():
    redact_secrets_new(test_string)

if __name__ == '__main__':
    assert redact_secrets_old(test_string) == redact_secrets_new(test_string)
    old_time = timeit.timeit(test_old, number=1000)
    new_time = timeit.timeit(test_new, number=1000)
    print(f"Old: {old_time:.4f}s")
    print(f"New: {new_time:.4f}s")
    print(f"Improvement: {(old_time - new_time) / old_time * 100:.2f}%")
