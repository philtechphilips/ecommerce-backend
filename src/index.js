import app from "./app";
import chalk from "chalk";
import config from "./config/index";

app.listen(config.port, () => {
  console.log(
    `${chalk.blue(
      `E-commerce running on ${config.baseUrl}:${config.port}`
    )}`
  );
});
