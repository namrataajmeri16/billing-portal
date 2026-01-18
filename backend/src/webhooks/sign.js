const crypto = require("crypto");
const fs = require("fs");

const payload = fs.readFileSync("./event.json");
const secret = "whsec_test";

const sig = crypto
  .createHmac("sha256", secret)
  .update(payload)
  .digest("hex");

console.log(sig);

