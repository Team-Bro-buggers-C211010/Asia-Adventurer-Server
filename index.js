const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.t8yk7hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristsCollection = client
      .db("tourists-spot-DB")
      .collection("tourists-spot");

    // Find all data of all-tourists-spot from MongoDB
    app.get("/all-tourists-spot/:userEmail", async (req, res) => {
        const userEmail = req.params.userEmail;
        const query = { userEmail: userEmail };
        const cursor = touristsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post("/all-tourists-spot", async (req, res) => {
      const newTouristsSpot = req.body;
      console.log(newTouristsSpot);
      const result = await touristsCollection.insertOne(newTouristsSpot);
      res.send(result);
    });

    // delete a data from MongoDB
    app.delete("/all-tourists-spot/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await touristsCollection.deleteOne(query);
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Asia Adventurer Server is here.");
});

app.listen(port, () => {
  console.log(`The Asia Adventurer Server is running on port ${port}`);
});
