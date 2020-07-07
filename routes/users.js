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
  res.render("login", {});
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  // const firebaseAuth = firebase.auth();
  await firebaseAuth.createUserWithEmailAndPassword(email, password).then((user) => {
    console.log(user.user.uid);
    if (user) {
      db.collection("user").doc().set({
        email,
        userId: user.user.uid,
        role: "customer"
      });
    }
  }).catch((err) => {
    console.log(err.message);
  });

  res.render("signup", { message: "create succesully" });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
  try {
    const { user } = result;
    console.log(user.email);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
});

router.get("/logout", async (req, res, next) => {
  await firebaseAuth.signOut();
  res.redirect("/users/login");
});

module.exports = router;
