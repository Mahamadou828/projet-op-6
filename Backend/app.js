const express = require("express"),
  app = express(),
  moongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  userRoute = require("./routes/user"),
  sauceRoute = require("./routes/sauces"),
  imageRoute = require("./routes/image");
moongoose
  .connect(
    "mongodb+srv://madou_s1:zlWJE2dD3IpM1y3c@cluster0-cbb5e.mongodb.net/Pekito?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connecte a mongo");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth/", userRoute);
app.use("/api/sauces/", sauceRoute);
app.use("/", imageRoute);

module.exports = app;
