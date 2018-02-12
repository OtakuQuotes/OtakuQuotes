import os

import aiohttp
import ujson

from sanic.blueprints import Blueprint
from sanic.response import json
from sanic.response import text

verify_url = 'https://google.com/recaptcha/api/siteverify'
secret_key = os.environ['CAPTCHA_SECRET']
submit = Blueprint('Submit', '/api/submit')

@submit.post("/")
async def post_quote(request):
    body = request.json
    if 'captcha' not in body or not body['captcha']:
        return json({'status': 400, 'success': False, 'message': 'No Captcha was Found.'}, status=400)

    
    captcha_body = {
        "secret": secret_key,
        "response": body['captcha'],
        "remoteip": request.ip
    }
    async with request.app.aiohttp_session.post(verify_url, data=ujson.dumps(captcha_body)) as req:
        if req.status != 200:
            return json({'status': req.status, 'success': False, 'message': req.text()}, status=req.status)
        try:
            anime = body['anime']
            char = body['char']
            quote = body['quote']
            episode = int(body['episode'])
            submitter = body['submitter']
        except KeyError:
            return json({'status': 400, 'success': False, 'error': 'Invalid Request'})

        async with request.app.postgresql.acquire() as conn:
            
            await conn.execute('''
                INSERT INTO otakuquotes.pending (quote_text, char_name, anime_name, episode, submitter_name, time_stamp)
                VALUES ($1, $2, $3, $4, $5, $6)
            ''', quote, char, anime, episode, submitter, '00:00:00')
            return json({'status': 200, 'success': True, 'message': 'Quote Submitted! Thanks for submitting!'})
