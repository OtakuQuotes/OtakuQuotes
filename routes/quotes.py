from sanic.blueprints import Blueprint
from sanic.response import json
from sanic_openapi import doc

import ujson

quotes = Blueprint('Quotes', '/api/quotes')

@quotes.get("/")
async def get_search_quotes(request):
    async with request.app.postgresql.acquire() as conn:
        args = request.raw_args.get('tags', '')
        results = min(int(request.raw_args.get('results', 25)), 100)
        quote_list = []

        prepstatement = await conn.prepare('''
            SELECT quotes.quote_id, quotes.quote_text,
            characters.char_name, anime.anime_name
            FROM otakuquotes.quotes
            LEFT JOIN otakuquotes.characters ON quotes.char_id = characters.char_id
            LEFT JOIN otakuquotes.anime ON characters.anime_id = anime.anime_id
            WHERE quotes.quote_text ILIKE $1 OR anime.anime_name ILIKE $1 OR characters.char_name ILIKE anime.anime_name
            LIMIT $2
        ''')

        results = await prepstatement.fetch(f'%{args}%', results)

    for record in results:
        quote_list.append({
            'quote_id': record['quote_id'],
            'quote': record['quote_text'],
            'anime': record['anime_name'],
            'char': record['char_name']
        })
    
    if quote_list:
        return json({'status': 200, 'quotes': quote_list})
    else:
        return json({'status': 404, 'error': 'No Quotes Found'}, status=404)


@quotes.get("/<quote_id:int>")
async def get_quote(request, quote_id):
    quote = await request.app.redis.get('quote_id:' + str(quote_id))

    if quote is None:
        async with request.app.postgresql.acquire() as conn:
            
            prepstatement = await conn.prepare('''
                SELECT quotes.quote_id, quotes.quote_text, quotes.date_added,
                quotes.episode, quotes.time_stamp, quotes.submitter_name,
                characters.char_name, characters.image, anime.anime_name
                FROM otakuquotes.quotes
                LEFT JOIN otakuquotes.characters ON quotes.char_id = characters.char_id
                LEFT JOIN otakuquotes.anime ON characters.anime_id = anime.anime_id
                WHERE quotes.quote_id = $1
            ''')

            result = await prepstatement.fetchrow(quote_id)
        if result is not None and 'quote_id' in result:
            quote = {
                'quote_id': result['quote_id'],
                'quote': result['quote_text'],
                'anime': result['anime_name'],
                'char': result['char_name'],
                'episode': result['episode'],
                'timestamp': str(result['time_stamp']),
                'date_added': str(result['date_added']),
                'submitter': result['submitter_name'],
                'image': result['image']
            }

            await request.app.redis.set('quote_id:' + str(quote_id), ujson.dumps(quote), expire=300)
        else:
            return json({'status': 404, 'error': 'Quote Not Found'}, status=404)
    else:
        quote = ujson.loads(quote)

    return json({'status': 200, 'quotes': quote})
