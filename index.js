const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
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
    const database = client.db("Car_Hatt");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const carsCollection = database.collection("cars");
    const reviewsCollection = database.collection("reviews");
    const blogsCollection = database.collection("blogs");
    //POST Api for addcar
    app.post("/addCar", async (req, res) => {
      const addCar = req.body;
      const result = await carsCollection.insertOne(addCar);
      res.send(result.insertedId);
    });
    //POST Api for addBlog
    app.post("/addBlog", async (req, res) => {
      const addBlog = req.body;

      const result = await blogsCollection.insertOne(addBlog);
      res.send(result.insertedId);
    });
    //POST Api for addReview
    app.post("/addReview", async (req, res) => {
      const addReview = req.body;
      const result = await reviewsCollection.insertOne(addReview);
      res.send(result.insertedId);
    });
    //GET API for show cars
    app.get("/cars", async (req, res) => {
      const result = await carsCollection.find({}).toArray();
      res.send(result);
    });
    //GET API for show cars on home page
    app.get("/homeCars", async (req, res) => {
      const result = await carsCollection.find({}).limit(6).toArray();
      res.send(result);
    });
    //GET API for show reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      res.send(result);
    });
    //GET API for show blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find({}).toArray();
      res.send(result);
    });
    //booking car to database
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      // console.log(order);

      res.json(result);
    });
    //booked order to show user at dashboar
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });
    //user send to database (reg)
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    //user send to database (google)
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //make admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    //check admin?
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      let isAdmin = false;
      if (user.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    //delete from  orders
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
      console.log(result);
    });
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
