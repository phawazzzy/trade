const express = require("express");

const router = express.Router();
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");
const Cloudinary = require("../config/cloudinary");

const db = admin.firestore();
const authChecker = require("../midwares/authChecker");

router.get("/dashboard", authChecker, (req, res) => {
  const pagename = "product";
  res.render("product", { title: "Dashboard", pagename });
});

router.post("/dashboard/newproduct", async (req, res) => {
  const {
    productName, productDes, productPrice, location, locationLng, locationLat
  } = req.body;
  console.log(req.body);
  const file = req.files.productImage;
  console.log(file);

  if (!productName || !productPrice || !productDes || !location) {
    console.log("please fill in all fields");
    return;
  }

  const uploader = await Cloudinary.uploads(file.tempFilePath, "trade");
  const fileUrl = uploader.url;
  const fileid = uploader.id;

  await db.collection("products").doc(productName).set({
    productName,
    productDes,
    productPrice,
    location,
    locationLng,
    locationLat,
    fileUrl,
    fileid
  }).catch((err) => {
    console.log(err.message);
  });

  console.log("success");

  res.redirect("/dashboard");
});

router.get("/", authChecker, async (req, res) => {
  const pagename = "dashboard";
  const allProducts = db.collection("products").where("location", "==", "lagos");
  const snapshot = await allProducts.get();
  // console.log(typeof snapshot.docs.data())
  const docs = snapshot.forEach((doc) => {
  });
  res.render("products", { title: "product list", docs, pagename });
});
module.exports = router;
