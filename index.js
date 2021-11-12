const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//conncetion uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unwup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//datbase
async function run() {
  try {
    await client.connect();
    const database = client.db("allCars");
    const carsCollection = database.collection("cars");

    console.log("database conncted");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//
app.get("/", (req, res) => {
  res.send("Hello car haat!");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
