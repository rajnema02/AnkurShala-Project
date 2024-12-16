const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./Helpers/init_mongodb");
// require('./Helpers/init_db_data')
// const socketIo = require('socket.io');
// const io = socketIo(server);
require("./Helpers/init_cron");
const cors = require("cors");
const debug = require("debug")(process.env.DEBUG + "server");
const path = require("path");
const compression = require("compression");
const createError = require("http-errors");
const https = require("https");
const fs = require("fs");

const app = express();

const options = {
  key: fs.readFileSync("./certs/private-key.pem"),
  cert: fs.readFileSync("./certs/certificate.pem"),
};

// const server = https.createServer(options, app);
const server = require("http").createServer(app);

if (process.env.ENV == "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

// increase upload body size to 50 MB
app.use(express.json(
  { limit: "50mb" },
));
app.use(express.urlencoded({ extended: true }));

// API Routes Start ------
app.use("/api/auth", require("./routes/Auth.route"));
app.use("/api/roles", require("./routes/role.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/user-geo-location", require("./routes/user-geo-location.route"));
app.use("/api/files", require("./routes/file.route"));
app.use("/api/class", require("./routes/class.route"))
app.use("/api/subject", require("./routes/subject.route"))
app.use("/api/chapter", require("./routes/chapter.route"))
app.use("/api/topic", require("./routes/topic.route"))
app.use("/api/teacherSchedule", require("./routes/teacherSchedule.route"))
app.use("/api/schedule",require("./routes/scheduleRequest.route"));


app.use("/api", (req, res, next) => {
  next(createError.NotFound());
});
// API Routes End --------

app.use(express.static(path.join(__dirname, "public", "dist", "browser")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "dist", "browser", "index.html"));
});

app.use((err, req, res, next) => {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.use(async (err, req, res, next) => {
  console.log(err);
  next(createError.NotFound(err));
});

const PORT = process.env.PORT || 3051;
server.listen(PORT, '0.0.0.0', () => {
  debug("Listening on " + PORT);
});
