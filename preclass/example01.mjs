import { Readable, pipeline, Transform } from 'stream'
import { promisify } from 'util'
const pipelineAsync = promisify(pipeline)
import { createWriteStream } from 'fs'
 

// // 1
await pipelineAsync(
    Readable({
        read: function () {
            for (let index = 0; index < 1e5; index++)
                this.push(JSON.stringify({ id: Date.now(), name: `Erick-${index}` }));

            this.push(null);

            // this.push(Buffer.from("Hello Dude"));
            // this.push(Buffer.from("Hello Dude2"));
            // this.push(Buffer.from("Hello Dude3"));
            // this.push(null);
        }
    }),

    // writable sempre é a saída -> imprimir, salvar, ignorar
    process.stdout,
    // Writable({
    //     write: (chunk, encoding, cb) => {
    //         console.log('msg', chunk.toString())
    //         cb();
    //     }
    // }),
)

// // 2
await pipelineAsync(
    Readable({
        read: function () {
            // 100K interações
            // for (let index = 0; index < 2; index++)
            for (let index = 0; index < 1e5; index++) {
                const person = { id: Date.now() + index, name: `Erick-${index}` }
                const data = JSON.stringify(person)
                this.push(data);
            }

            this.push(null);

            // this.push(Buffer.from("Hello Dude"));
            // this.push(Buffer.from("Hello Dude2"));
            // this.push(Buffer.from("Hello Dude3"));
            // this.push(null);
        }
    }),
    Transform({
        transform: (chunk, enconding, cb) => {
            const data = JSON.parse(chunk)
            const result = `${data.id},${data.name.toUpperCase()}\n`
            cb(null, result)
        }
    }),
    Transform({
        transform: function (chunk, enconding, cb) {
            this.counter = this.counter ?? 0;

            if (this.counter) {
                return cb(null, chunk)
            }

            this.counter += 1;
            cb(null, "id,name\n".concat(chunk))

        }
    }),
    // process.stdout,
    createWriteStream('my.csv')
)
