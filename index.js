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
