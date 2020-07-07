/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require("express");
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");

const db = admin.firestore();

const authCheker = async (req, res, next) => {
  try {
    await firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        console.log("please login before your have access");
        return res.redirect("/users/login");
      }
      console.log("from authchecker", user.email);
      req.user = user.email;
      next();
    });
  } catch (error) {
    return res.status(403).json({ response: error.message });
  }
};

module.exports = authCheker;
