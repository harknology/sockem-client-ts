# Sockem TypeScript Client
See <https://sockem.harknology.com> for more documentation.

```ts
import { Sockem } from "@harknology/sockem"
const client = new Sockem();
await client.authenticate('myS3CR3tkeY')
await client.listen('eventStream')
await client.send('eventStream', 'test')

for await (const msg of client.receive()) {
  doStuff(msg)
}
```
