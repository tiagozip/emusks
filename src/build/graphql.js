const URL = `https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/refs/heads/develop/docs/json/API.json`;

const json = await fetch(URL).then((r) => r.json());
const graphql = json.graphql;

const transformed = Object.fromEntries(
  Object.entries(graphql).map(([name, data]) => {
    const features = data.features
      ? Object.fromEntries(Object.keys(data.features).map((k) => [k, true]))
      : undefined;
    const queryId = data.url.match(/\/graphql\/([^/]+)\//)?.[1];
    return [name, [data.method, data.url, features, queryId]];
  }),
);

await Bun.write(
  `./src/static/graphql.js`,
  `export default ${JSON.stringify(transformed)};`,
);
