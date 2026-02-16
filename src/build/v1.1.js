const URL = `https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/refs/heads/develop/docs/json/v1.1.json`;

const json = await fetch(URL).then((r) => r.json());

const seen = new Set();
const duplicates = new Set();

for (const entry of json) {
  const queryId = entry.queryId.replace(/^\//, "");
  if (seen.has(queryId)) {
    duplicates.add(queryId);
  }
  seen.add(queryId);
}

const transformed = {};

for (const entry of json) {
  const queryId = entry.queryId.replace(/^\//, "");
  const method = entry.dispatch[0];
  const urlTemplate = entry.dispatch[2];
  const url = urlTemplate.replace("{queryId}", queryId);

  const key = duplicates.has(queryId) ? `${method}:${queryId}` : queryId;
  transformed[key] = [method, url];
}

await Bun.write(`./src/static/v1.1.js`, `export default ${JSON.stringify(transformed)};`);
