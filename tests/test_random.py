import requests


def test_random():
    with requests.get('http://localhost:8080/api/random') as r:
        assert r.status_code < 500