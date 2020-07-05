/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require("express");
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");

const db = admin.firestore();

const authCheker = (req, res, next) => {
  const user = firebase.auth().currentUser;
  if (user == null) {
    console.log("please login before your have access");
    return res.redirect("/users/login");
  }
  console.log(user.email);
  req.user = user.email;
  next();
};

module.exports = authCheker;
