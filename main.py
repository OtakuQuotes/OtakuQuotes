import argparse
import os

import aiohttp

from sanic import Sanic
from sanic import response
from sanic.exceptions import NotFound

from routes.pending import pending
from routes.quotes import quotes
from routes.random import random
from routes.submit import submit


import asyncpg
import aioredis

app = Sanic()

@app.route("/docs")
async def docs(request):
    return response.redirect('https://otakuquotes.docs.apiary.io')

@app.listener('before_server_start')
async def setup_db(app, loop):
    app.postgresql = await asyncpg.create_pool(
        host=os.environ['PGHOST'],
        port=os.environ['PGPORT'],
        user=os.environ['PGUSER'],
        database=os.environ['PGDATABASE'],
        password=os.environ['PGPASSWORD'])
    
    app.redis = await aioredis.create_redis_pool(os.environ['REDIS_URL'])
    app.aiohttp_session = aiohttp.ClientSession()


@app.listener('after_server_stop')
async def close_db(app, loop):
    app.redis.close()
    await app.redis.wait_closed()
    await app.postgresql.close()

app.blueprint(pending)
app.blueprint(quotes)
app.blueprint(random)
app.blueprint(submit)

@app.exception(NotFound)
async def this404(request, exception):
    try:
        return await response.file('./client/build/' + request.path)
    except (NotFound, FileNotFoundError):
        return await response.file('./client/build/index.html')

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(description='Starting OtakuQuotes')
    parser.add_argument('-p', '--port', type=int, default=os.environ.get('PORT', 8080), help='Port to run on.')
    args = parser.parse_args()

    app.run(host="0.0.0.0", port=args.port)