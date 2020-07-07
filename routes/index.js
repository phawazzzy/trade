/* eslint-disable no-console */
const express = require("express");

const router = express.Router();
const firebase = require("firebase");
const Auth = require("firebase/auth");
const admin = require("firebase-admin");
const { generate } = require("raidmaker");
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
  let result;
  console.log("from index", req.user);
  if (req.user) {
    console.log("this person is  an admin");
    const productRef = db.collection("products");
    const snapshot = await productRef.get();
    result = snapshot.docs.map((doc) => doc.data());
    // console.log(result);
  } else {
    console.log("not an admin");
  }
  res.render("products", { title: "product list", pagename, result });
});

router.get("/product/:productName", async (req, res) => {
  const pagename = "productDetails";
  console.log(typeof req.params.productName);
  const productRef = db.collection("products").doc(req.params.productName);
  const doc = await productRef.get();
  if (!doc.exists) {
    console.log("Product not found");
    return;
  }
  const result = doc.data();
  let result2;
  if (result) {
    const commentRef = db.collection("comments");
    const snapshot = await commentRef.where("ref", "==", req.params.productName).get();
    result2 = snapshot.docs.map((doc2) => doc2.data());
    result2 = snapshot.empty ? undefined : result2;
    console.log(typeof result2);
  }
  res.render("oneproduct", {
    title: `${result.productName}`, result, result2, pagename
  });
});

router.post("/product/comments", authChecker, async (req, res) => {
  const { comment, ref } = req.body;
  console.log(comment, ref, generate(5));
  const commentRef = db.collection("comments");
  await commentRef.doc().set({
    ref,
    commentId: generate(5),
    comment
    // user: req.user.email
  }).then((result) => {
    if (result) {
      console.log("yayy...i got the result oo");
    }
  }).catch((e) => {
    console.log(e);
  });

  res.redirect(`/product/${ref}`);
});

module.exports = router;
