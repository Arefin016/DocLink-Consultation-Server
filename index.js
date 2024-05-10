const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ryecn6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const addServiceCollection = client.db('docServiceDB').collection('addService');
    const serviceProviderCollection = client.db('docServiceDB').collection('serviceProvider');

    //Add Service get read from data to the server to client
    app.get('/addService', async(req, res) => {
        const cursor = addServiceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    //Add Service send to server to database
    app.post('/addService', async(req, res) => {
        const newAddService = req.body;
        console.log(newAddService);
        const result = await addServiceCollection.insertOne(newAddService);
        res.send(result);
    })

    //User information send to server to database
    app.post('/serviceProvider', async(req, res) => {
        const serviceProvider = req.body;
        console.log(serviceProvider);
        const result = await serviceProviderCollection.insertOne(serviceProvider);
        res.send(result);
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('Doctor Service Server is running');
})

app.listen(port, () => {
    console.log(`Doctor Service Server is running on port: ${port}`)
})