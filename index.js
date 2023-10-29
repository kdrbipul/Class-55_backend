const express = require ("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midleware    

app.use(cors());
app.use(express.json()); //solve req.body undefined



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.veugrci.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("curdServer");
    const userCollection = database.collection('user');
    const user = {
        userId : 1, userName: "abdul kader", age: 23
    };
    const result = await userCollection.insertOne(user);
    console.log(result);


    app.get('/users', async(req, res)=>{
      const query = {}
      const cursor = userCollection.find(query)
      const users = await cursor.toArray()
      res.send(users)
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    app.post('/users', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
  } finally {
    
  }
}
run().catch(console.dir);



app.get("/", (req, res)=>{
    console.log("our server is successfully done");
})

app.listen(port, () =>{
    console.log(`our server is run to : ${port}`);
})