"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// MongoDB Connection:

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const dbConnection = function () {
  // Connect:
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("* DB Connected * ");
      //: Syncronization must be done manually. Because it clears the database.
      // require('./sync')()
    })
    .catch((err) => console.log("* DB Not Connected * ", err));
};

/* ------------------------------------------------------- */
module.exports = {
  mongoose,
  dbConnection,
};
