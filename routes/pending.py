from sanic.blueprints import Blueprint
from sanic.response import json

import ujson

pending = Blueprint('Pending', '/api/pending')


@pending.get("/")
async def get_search_pending_quotes(request):
    async with request.app.postgresql.acquire() as conn:
        args = request.raw_args.get('tags', '')
        results = min(int(request.raw_args.get('results', 25)), 100)
        quote_list = []

        prepstatement = await conn.prepare('''
        
            SELECT quote_id, quote_text, anime_name, char_name 
            FROM otakuquotes.pending WHERE quote_text 
            ILIKE $1 OR anime_name ILIKE $1 OR char_name ILIKE $1 
            LIMIT $2
        ''')

        results = await prepstatement.fetch(f'%{args}%', results)

    for record in results:
        quote_list.append({
            'pending_id': record['quote_id'],
            'quote': record['quote_text'],
            'anime': record['anime_name'],
            'char': record['char_name']
        })
    
    if quote_list:
        return json({'status': 200, 'quotes': quote_list})
    else:
        return json({'status': 404, 'error': 'No Quotes Found'}, status=404)


@pending.get("/<quote_id:int>")
async def get_pending_quote(request, quote_id):
    quote = await request.app.redis.get('pending_id:' + str(quote_id))

    if quote is None:
        async with request.app.postgresql.acquire() as conn:
            
            prepstatement = await conn.prepare('''
                SELECT * 
                FROM otakuquotes.pending
                WHERE quote_id = $1
            ''')

            result = await prepstatement.fetchrow(quote_id)
        if result is not None and 'quote_id' in result:
            quote = {
                'pending_id': result['quote_id'],
                'quote': result['quote_text'],
                'anime': result['anime_name'],
                'char': result['char_name'],
                'episode': result['episode'],
                'timestamp': str(result['time_stamp']),
                'submitter': result['submitter_name'],
                'date_submitted': str(result['date_submitted']),
            }

            await request.app.redis.set('pending_id:' + str(quote_id), ujson.dumps(quote), expire=300)
        else:
            return json({'status': 404, 'error': 'Quote Not Found'}, status=404)
    else:
        quote = ujson.loads(quote)

    return json({'status': 200, 'quotes': quote})
