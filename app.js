const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");

const hpp = require("hpp");
// const limiter = rateLimit({
//   windowMs: 30 * 60 * 1000, // 30 minutes
//   max: 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message:
//     "Vous avez lancé trop de requete. Veuillez reassayer dans 30 minutes",
// });
const app = express();
const globalErrorHandler = require("./controllers/errorController");
app.use(cors());
// app.use("/api", limiter);
app.use(express.json({ limit: "500kb" }));
app.use(mongoSanitize());
app.use(xssClean());

app.use(
  hpp({
    whitelist: [
      //...
    ],
  })
);

app.use(helmet());
const userRouter = require("./routes/userRoute");
const familyRouter = require("./routes/familyRoute");
const relationRouter = require("./routes/relationRoute");
const requestRouter = require("./routes/requestRoute");
const photoAlbumRouter = require("./routes/photoAlbumRoute");
const photoRouter = require("./routes/photoRoute");
const paymentRouter = require("./routes/paymentRoute");
app.use(express.static("public"));
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/family/", familyRouter);
app.use("/api/v1/relations/", relationRouter);
app.use("/api/v1/requests/", requestRouter);
app.use("/api/v1/photoalbum/", photoAlbumRouter);
app.use("/api/v1/photo/", photoRouter);
app.use("/api/v1/payments/", paymentRouter);
app.use(globalErrorHandler);
app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Aucun point d'entrée ne correspond a "${req.originalUrl}" sur ce serveur`,
  });
});
module.exports = app;
