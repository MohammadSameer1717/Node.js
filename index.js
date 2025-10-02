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
