# Installation

Install emusks using your preferred package manager:

::: code-group

```sh [npm]
npm install emusks
```

```sh [yarn]
yarn add emusks
```

```sh [pnpm]
pnpm add emusks
```

```sh [bun]
bun add emusks
```

:::

You'll now be able to import `emusks` in your project:
```ts
import Emusks from "emusks";

const client = new Emusks();
await client.login("your_auth_token");

const user = await client.users.getByUsername("elonmusk");
console.log(user.name);
```

## Next Steps

Now that you have emusks installed, head over to [Authentication](/getting-started/authentication) to learn how to log in and start making requests.
