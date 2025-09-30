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
