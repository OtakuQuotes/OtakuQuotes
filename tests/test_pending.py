import requests


def test_pending_search():
    with requests.get('http://localhost:8080/api/pending?tags=Fate') as r:
        assert r.status_code < 500

def test_get_pending_quote():
    with requests.get('http://localhost:8080/api/pending/2') as r:
        assert r.status_code < 500