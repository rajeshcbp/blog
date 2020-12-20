const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("./app/handlers/logHandlers");
var path = require("path");
var cors = require("cors");
const app = express();
const router = express.Router();
const helmet = require("helmet");

var config = require("./config");
var port = config.port;
var connUri = config.dbUri;

//DB connection
mongoose.connect(
  connUri,
  {
    //reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    useCreateIndex: true,
    //autoReconnect: true,
    useUnifiedTopology: true,
  },
  function (err, db) {
    if (err) {
      console.log("<----------------------------------------------->");
      logger.error("DB filed to connect : " + err.message);
      console.log("<----------------------------------------------->");
      return;
    } else {
      logger.info(`DB Connected successfully : ${connUri}`);
      console.log("<----------------------------------------------->");
    }
  }
);

// Default Helmet Options
// ================================================
// contentSecurityPolicy: false, for setting Content Security Policy
// expectCt: false, for handling Certificate Transparency
// dnsPrefetchControl: true, controls browser DNS prefetching	✓
// frameguard: true, to prevent clickjacking	✓
// hidePoweredBy: true, to remove the X-Powered-By header	✓
// hpkp: false, for HTTP Public Key Pinning
// hsts: true, for HTTP Strict Transport Security	✓
// ieNoOpen: true, sets X-Download-Options for IE8+	✓
// noCache: false, to disable client-side caching
// noSniff: true, to keep clients from sniffing the MIME type	✓
// referrerPolicy: false, to hide the Referer header
// xssFilter: false, adds some small XSS protections
app.use(
  helmet({
    noCache: false,
  })
);

// configure our app to handle CORS requests
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Access-Control-Allow-Origin"
  );
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

app.use(express.static(path.join(__dirname, "./app/public")));

const routes = require("./app/routes/index.js");

app.use("/api/v1", routes(router));

//Server setup

app.listen(port, () => {
  console.log("<----------------------------------------------->");
  logger.info("Blog Server lististing at port : " + port);
  console.log("<----------------------------------------------->");
  //console.log("Server Conneted to DB = " + connUri);
});

module.exports = app;
