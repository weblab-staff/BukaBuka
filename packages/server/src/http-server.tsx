import path from "path";
import express from "express";
import compression from "compression";
import logger from "morgan";
import bodyParser from "body-parser";
import ReactDOMServer from "react-dom/server";
import { App } from "@bukabuka/app";
import ApiRouter from "./routers/ApiRouter";

const appRootDirectory = path.dirname(
  require.resolve("@bukabuka/app/package.json")
);
const appBundleDirectory = path.join(appRootDirectory, "dist/umd");

export function createHttpServer(): express.Express {
  const app = express();
  app.use(logger("dev"));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", ApiRouter);
  app.get('/heartbeat', (_, res) => {
    res.status(200).send({msg: "hello world"});
  })
  app.get("/server", ssrHandler);
  app.use(express.static(appBundleDirectory));
  return app;
}

function ssrHandler(_req: express.Request, res: express.Response) {
  res.end(
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="Description" content="Buka buka server-side renderer app">
    <title>Buka Buka</title>
    <link href="main.css" rel="stylesheet">
</head>
<body>
    <div id="SITE_MAIN" data-ssr>
        ${ReactDOMServer.renderToString(<App/>)}
    </div>
    <script type="text/javascript" src="main.js"></script>
</body>
</html>`
  );
}
