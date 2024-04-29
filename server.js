const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./var.env" });
const port = process.env.APP_PORT || 7001;
const app = require("./app");

databaseURI = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(databaseURI, {})
  .then((connectionInfo) => {
    console.log("Connexion a la base de donnée réussie");
  })
  .catch((err) => {
    console.log("Erreur lors de la connexion a la base de donnée");
    console.log(err);
  });
app.listen(port, () => {
  console.log(
    `Votre application demarre sur http://localhost:${port} . Veuillez lancer vos requetes a cette addresse`
  );
});
