/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require("express");
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");

const db = admin.firestore();

// eslint-disable-next-line consistent-return
const authCheker = async (req, res, next) => {
  // admin.auth().getUserByEmail("phawazzzy@gmail.com")
  //   .then((userRecord) => {
  //     console.log(userRecord.uid);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  try {
    const user = await firebase.auth().currentUser;
    if (!user) {
      console.log("please login before your have access");
      return res.redirect("/users/login");
    }
    console.log("from authchecker", user.uid);
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(403).json({ response: error.message });
  }
};

module.exports = authCheker;
