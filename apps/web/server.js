/* eslint-disable turbo/no-undeclared-env-vars */
const { createServer } = require("node:https");
const { parse } = require("node:url");
const fs = require("node:fs");
const next = require("next");

const hostname = "localhost";
const port = 8000;

const options = {
  key: fs.readFileSync("../../localhost-key.pem"),
  cert: fs.readFileSync("../../localhost.pem"),
};

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: true, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(options, async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;

    // eslint-disable-next-line no-console
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
