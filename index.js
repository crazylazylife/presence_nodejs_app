const express = require("express");
//var firebase = require("firebase/app");

// Add the Firebase products that you want to use
//var fireAuth = require("firebase/auth");
//var firestore = require("firebase/firestore");
const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static("public"));

// Provide access to node_modules folder
//app.use("/scripts", express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info("listening on %d", port);
});
