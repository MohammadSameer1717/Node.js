// Code (basic) — show microtask vs macrotask order: 

console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

console.log('end');
// Output:
// start
// end
// promise
// timeout

// Code (variation: using setImmediate vs setTimeout)

console.log('A');
setImmediate(() => console.log('immediate'));
setTimeout(() => console.log('timeout-0'), 0);
Promise.resolve().then(() => console.log('microtask'));
console.log('B');


// Code (Promise):
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    require('fs').readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

readFilePromise('./data.txt')
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));

//   Code (async/await variation):

const fs = require('fs').promises;

async function showFile() {
  try {
    const data = await fs.readFile('./data.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file', err);
  }
}
showFile();

// Q:3 = Code (Promises):
asyncOperation()
  .then(result => doNext(result))
  .catch(err => {
    console.error('Failed:', err);
  });

  // Code (async/await + express error middleware):
  app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await db.getUser(req.params.id);
    if (!user) return res.status(404).send('Not found');
    res.json(user);
  } catch (err) {
    next(err); // forwarded to error middleware
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Q:4 = Code (file stream basic):
const fs = require('fs');

const read = fs.createReadStream('bigfile.txt', { encoding: 'utf8' });
const write = fs.createWriteStream('out.txt');

read.pipe(write);

read.on('error', console.error);
write.on('error', console.error);

// Code (Transform variation — uppercase):
const { Transform } = require('stream');

const upper = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin.pipe(upper).pipe(process.stdout);

// Q:5 = Code (cluster basic):
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i=0;i<numCPUs;i++) cluster.fork();
  cluster.on('exit', (worker) => console.log('Worker died', worker.id));
} else {
  http.createServer((req,res) => res.end('ok')).listen(3000);
}

// Q:6 = Code (Express example):
app.get('/v1/users', async (req, res) => {
  const users = await db.listUsers({ page: req.query.page || 1 });
  res.json(users);
});

// Q:7 = Code (JWT sign/verify):
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const token = jwt.sign({ userId: 123 }, secret, { expiresIn: '1h' });

try {
  const payload = jwt.verify(token, secret);
  console.log(payload.userId);
} catch (err) {
  console.error('Invalid token');
}

// Q:8 = Code (Postgres with node-postgres):
const { Pool } = require('pg');
const pool = new Pool();

async function transfer(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// = Code (Prisma example):
const user = await prisma.user.findUnique({ where: { id: 1 }, include: { posts: true } });
// Code (raw SQL with pg):
const res = await pool.query('SELECT u.*, COUNT(p.*) AS post_count FROM users u LEFT JOIN posts p ON p.user_id = u.id WHERE u.id = $1 GROUP BY u.id', [id]);

// Q:10  Code (cache-aside with Redis):
const redis = require('redis');
const client = redis.createClient();

async function getUser(id) {
  const cached = await client.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  const user = await db.getUser(id);
  await client.setEx(`user:${id}`, 3600, JSON.stringify(user));
  return user;
}

// Q:11 = Code (pino minimal):
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

logger.info({ reqId: 'abc123', userId: 12 }, 'User fetched profile');
logger.error({ err: err }, 'Failed to update');


// Q:12 = Code (Express + rate-limit using Redis store):
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const limiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args)=>redisClient.sendCommand(args) }),
  windowMs: 60*1000,
  max: 100, // per window per IP
  handler: (req,res)=> res.status(429).json({ error: 'Too many requests' })
});
app.use(limiter);

// Q13: =Code (Express + multer basic):
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

const app = express();
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename, original: req.file.originalname });
});

// Code (variation: stream upload directly to AWS S3 using aws-sdk v3):
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({});
app.post('/upload-s3', (req, res) => {
  const key = `uploads/${Date.now()}-${req.headers['x-file-name']}`;
  const uploadParams = { Bucket: 'my-bucket', Key: key, Body: req };
  s3.send(new PutObjectCommand(uploadParams))
    .then(() => res.json({ key }))
    .catch(err => res.status(500).json({ error: err.message }));
});
// Note: this expects the client to stream raw body; requires proper content-type handling.

