import requests


def test_get_quote_search():
    with requests.get('http://localhost:8080/api/quotes?tags=Fate') as r:
        assert r.status_code < 500

def test_get_quote():
    with requests.get('http://localhost:8080/api/quotes/1') as r:
        assert r.status_code < 500