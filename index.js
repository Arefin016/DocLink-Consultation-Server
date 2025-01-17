const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const bookingServiceCollection = client.db('docServiceDB').collection('bookings');
    const popularServicesCollection = client.db('docServiceDB').collection('popularServices');

    //Add Service get read from data to the server to client
    app.get('/addService', async(req, res) => {
        const cursor = addServiceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/addService/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options = {
            projection: {photo: 1, serviceName: 1, description:1, price:1, serviceProvideImage:1,   serviceProviderName:1, serviceArea: 1, serviceID: 1, _id: 1}
        }
        const result = await addServiceCollection.findOne(query, options);
        res.send(result);
    })
    //Add Service information get specific filter by email from database to server
    app.get('/serviceProvider', async(req, res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await serviceProviderCollection.find(query).toArray();
        res.send(result)
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
    app.put('/serviceProvider/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updateService = req.body;
        const service = {
            $set: {
                // photo, serviceName, price, serviceArea, description
                photo: updateService.photo,
                serviceName: updateService.serviceName,
                price: updateService.price,
                serviceArea: updateService.serviceArea,
                description:updateService.description
            }
        }
        const result = await serviceProviderCollection.updateOne(filter, service, options)
        res.send(result);
    })
    app.delete('/serviceProvider/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await serviceProviderCollection.deleteOne(query);
        res.send(result);
    })
    //Update Operation
    app.get('/serviceProvider/:id', async(req, res) => {
        const id = req.params.id;
        const query  = {_id: new ObjectId(id)}
        const result = await serviceProviderCollection.findOne(query);
        res.send(result)
    })

    // bookings
    app.get('/bookings', async(req, res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await bookingServiceCollection.find(query).toArray();
        res.send(result);
    }) 

    app.post('/bookings', async(req, res) => {
        const booking = req.body;
        console.log(booking);
        const result = await bookingServiceCollection.insertOne(booking);
        res.send(result);
    })

    app.get('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const query  = {_id: new ObjectId(id)}
        const result = await bookingServiceCollection.findOne(query);
        res.send(result)
    })

    //Update bookings
    app.patch('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedBooking = req.body;
        console.log(updatedBooking);
        const updatedDoc = {
            $set: {
                status: updatedBooking.status
            },
        }
        const result = await bookingServiceCollection.updateOne(filter, updatedDoc);
        res.send(result)
    })

    app.delete('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await bookingServiceCollection.deleteOne(query);
        res.send(result);
    })

    //Popular services
    app.get('/popularServices', async(req, res) => {
        const cursor = popularServicesCollection.find();
        const result = await cursor.toArray();
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