import initCycleTLS from "cycletls";

let cycleTLS;

initCycleTLS().then((c) => {
  cycleTLS = c;
});

export default async function getCycleTLS() {
  if (!cycleTLS) {
    await new Promise((r) => {
      const c = setInterval(() => {
        if (cycleTLS) {
          clearInterval(c);
          r();
        }
      }, 10);
    });
  }

  return cycleTLS;
}

process.on("exit", () => {
  if (cycleTLS) cycleTLS.exit();
});
