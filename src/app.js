import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import bodyParser from "body-parser";

import config from "./config";
import v1Router from "./routes/index.js";
import initialize from "./config/db";

const app = new express();

initialize();

// Setup middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("tiny"));
app.use(
  fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 },
    useTempFiles: true,
    abortOnLimit: true,
    responseOnLimit: "Maximum upload size is 25MB",
  })
);
app.use(
  bodyParser.json({ limit: "50mb", extended: true, parameterLimit: "50mb" })
);
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: "100000" }));

app.use("/v1", v1Router);

app.get("/", (req, res) => {
  res.send({
    status: 200,
    message: "Welcome to Virtuc E-commerce website  v1.0",
  });
});

app.use(function (req, res, next) {
  res
    .status(404)
    .send({ responseCode: 404, message: "Invalid resource URL", data: [] });
  next();
});

export default app;
