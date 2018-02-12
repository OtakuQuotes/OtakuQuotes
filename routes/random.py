import random as rand

import ujson

from sanic.blueprints import Blueprint
from sanic.exceptions import ServerError
from sanic.response import json


rng = rand.Random()
rng.seed()

random = Blueprint('Random', '/api/random')

@random.get("/")
async def get_random_quote(request):
    async with request.app.postgresql.acquire() as conn:
        quote_count = await request.app.redis.get('quotecount')
        if quote_count is None:
            quote_count = await conn.fetchval('''SELECT max(quote_id) FROM otakuquotes.quotes''')
            await request.app.redis.set('quotecount', quote_count)
            # Grab rows from postgresql
            # Update Redis quote_count
        random_id = rng.randint(1, int(quote_count))
        quote = await request.app.redis.get(f'quote_id:{random_id}')

        if quote is None:
            prepstatement = await conn.prepare('''
                SELECT quotes.quote_id, quotes.quote_text, quotes.date_added, quotes.episode, 
                quotes.time_stamp, quotes.submitter_name, 
                characters.char_name, characters.image, anime.anime_name 
                FROM otakuquotes.quotes 
                LEFT JOIN otakuquotes.characters ON quotes.char_id = characters.char_id 
                LEFT JOIN otakuquotes.anime ON characters.anime_id = anime.anime_id 
                WHERE quotes.quote_id = $1
            ''')
            quote = await prepstatement.fetchrow(random_id)
        else:
            quote = ujson.loads(quote)
        
    if quote is None:
        return json({'status': 404, "error": "Quote Not Found"}, status=404)
    else:
        await request.app.redis.set(f'quote_id:{random_id}', ujson.dumps(dict(quote)))
        
    return json({'status': 200,
        'quotes': {
            'quote_id': quote['quote_id'],
            'quote': quote['quote_text'],
            'anime': quote['anime_name'],
            'char': quote['char_name'],
            'episode': quote['episode'],
            'timestamp': quote['time_stamp'],
            'date_added': quote['date_added'],
            'submitter': quote['submitter_name'],
            'image': quote['image']
        }
    })