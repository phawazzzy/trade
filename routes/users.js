/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const express = require("express");

const router = express.Router();
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");

const firebaseAuth = firebase.auth();

const db = admin.firestore();

/* GET users listing. */
router.get("/login", (req, res, next) => {
  const error = req.flash("error");
  res.render("login", { error });
});

router.get("/signup", (req, res, next) => {
  const error = req.flash("error");
  res.render("signup", { error });
});

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    console.log(user.user.email);
    if (user) {
      db.collection("user").doc().set({
        email,
        userId: user.user.uid,
        role: "customer"
      }).then((result) => { console.log("user saved"); })
        .catch((e) => console.log(e.message));
    }
  } catch (error) {
    console.log(error.message);
    req.flash("error", `${error.message}`);
  }

  res.render("signup", { message: "create succesully" });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
    const { user } = result;
    console.log("from uer", user.uid);
  } catch (error) {
    console.log(error.message);
    req.flash("error", `${error.message}`);
  }
  res.redirect("/");
});

router.get("/logout", async (req, res, next) => {
  await firebaseAuth.signOut();
  res.redirect("/users/login");
});

module.exports = router;
