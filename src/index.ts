import fastify from 'fastify';
import fs from 'fs';
import {promisify} from 'util';

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const app = fastify();

app.get('/', async (_, reply) => {
    reply.send({message: 'Hello world!'});
});

app.get('/meme', async (_, reply) => {
    const files = await readDir(__dirname + '/memes');

    reply.send({
        memes: files.map(
            (fileName) =>
                `http://localhost:3000/meme/${fileName.replace('.png', '')}`,
        ),
    });
});

app.get<{Params: {id: string}}>('/meme/:id', async (request, reply) => {
    const files = await readDir(__dirname + '/memes');

    const key = request.params.id;
    if (!files.find((fileName) => fileName === `${key}.png`)) {
        reply.send({message: 'Not found'});
    }

    const file = await readFile(__dirname + `/memes/${key}.png`);
    reply.type('image/png').send(file);
});

async function start() {
    await app.listen({port: 3000, host: '0.0.0.0'});
    console.log('Server listening on port 3000');
}

start();
