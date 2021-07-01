// process.stdin

process.stdin.pipe(process.stdout)

.on('data', msg => console.log('data', msg.toString()))
.on('error', msg => console.log('error', msg.toString()))
.on('end', _ => console.log('end'))
.on('close', _ => console.log('close'))

// process.stdin.pipe(require("net").connect(1338))

// require("net").createServer(socket => socket.pipe(process.stdout)).listen(1338);

import http from 'http'
import { createReadStream, readFileSync } from 'fs'
http
    .createServer((req, res) => {
        // const file = readFileSync('big.file').toString()
        // res.write(file)
        // res.end()

        createReadStream("big.file")
            .pipe(res);
    })
    .listen(3000, () => console.log("running"));
// curl localhost:3000 -o output.txt