const mongoose = require("mongoose");
const dotenv = require("dotenv");
//placed handler her to catch errors cuz its sync
process.on("uncaughtException", (err) => {
  console.log("uncaughtException shutting down");
  console.log(err);

  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB).then((con) => {
  console.log("connected to db");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection shutting down");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
