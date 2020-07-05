/* eslint-disable no-unused-vars */
const express = require("express");

const router = express.Router();
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");

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
  console.log(email, password);
  const firebaseAuth = firebase.auth();
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

  res.redirect("/");
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  const firebaseAuth = firebase.auth();
  await firebaseAuth.signInWithEmailAndPassword(email, password).then((user) => {
    console.log("user signed in succesfully");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        const { displayName } = user;
        const { email } = user;
        const { emailVerified } = user;
        const { uid } = user;
        const { providerData } = user;
      } else {
        console.log("no user available");
      }
    });
  }).catch((err) => {
    console.log(err.message);
  });

  res.redirect("/");
});

module.exports = router;
