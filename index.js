require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const servicesCollection = client.db("cleanCo").collection("service");

    /*
      get /get-service => all data
      post /add-service => create new data
      put /update-service => modify a data on collection
      delete /delete-service => delete a data from collection
    */

    app.get("/", async (req, res) => {
      res.send("Hello bro");
    });

    app.get("/get-service", async (req, res) => {
      const services = await servicesCollection.find({}).toArray();
      console.log(services);
      res.send(services);
    });

    app.post("/add-service", async (req, res) => {
      const data = req.body;
      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });

    app.put("/update-service/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: data };
      const option = { upsert: true };

      const result = await servicesCollection.updateOne(
        filter,
        updateDoc,
        option
      );

      res.send(result);
    });

    app.delete("/delete-service/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);

      res.send(result);
    });

    //* With try catch block

    // app.post("/add-service", async (req, res) => {
    //   try {
    //     const data = req.body;
    //     const result = await servicesCollection.insertOne(data);
    //     res.send({ status: true, result: result });
    //   } catch (error) {
    //     res.send({ status: false, error });
    //   }
    // });
  } finally {
  }
}
run().catch(console.dir);

// Body

app.get("/dummy-route/user2", async (req, res) => {
  const data = req.body;

  res.json(data);
});

// Query

app.get("/dummy-route/user", async (req, res) => {
  const { name, age } = req.query;
  console.log(name);
  console.log(age);
  res.json(name);
});

// Param

app.get("/dummy-route/user/:id", async (req, res) => {
  const { id } = req.params;

  res.json(id);
});

app.get("/", async (req, res) => {
  res.json("Hello");
});

app.listen(port, () => {
  console.log(`Ami Dowracchi port ${port}`);
});
