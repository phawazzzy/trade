const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const firebase = require("firebase");
const admin = require("firebase-admin");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const flash = require("express-flash");
const dotenv = require("dotenv");

dotenv.config();
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const firebaseConfig = {
  apiKey: "AIzaSyASUFp_ZKzlytJQEnv8xdqSIBGCZIAfoEc",
  authDomain: "trade-dbbd7.firebaseapp.com",
  databaseURL: "https://trade-dbbd7.firebaseio.com",
  projectId: "trade-dbbd7",
  storageBucket: "trade-dbbd7.appspot.com",
  messagingSenderId: "523267512207",
  appId: "1:523267512207:web:88165dfa7f0ba594999dfa",
  measurementId: "G-V0KRS6T035"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

const serviceAccount = require("./trade-dbbd7-firebase-adminsdk-lt8xl-ad25cf0ac7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "trade-dbbd7.appspot.com",
  databaseURL: "https://trade-dbbd7.firebaseio.com"
});

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("trust proxy", 1);
app.use(session({
  secret: "mysecrect",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(flash());

app.use(fileUpload({
  useTempFiles: true
}));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
