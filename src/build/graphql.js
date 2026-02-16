const URL = `https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/refs/heads/develop/docs/json/API.json`;

const json = await fetch(URL).then((r) => r.json());
const graphql = json.graphql;

const buildUrl = (base, features) => {
  const params = new URLSearchParams();

  if (features && Object.keys(features).length) {
    params.set(`features`, JSON.stringify(features));
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
};

const transformed = Object.fromEntries(
  Object.entries(graphql).map(([name, data]) => {
    const constructedUrl = buildUrl(data.url, data.features);
    return [name, [data.method, constructedUrl]];
  }),
);

await Bun.write(`./src/static/graphql.js`, `export default ${JSON.stringify(transformed)};`);
