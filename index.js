const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fycsihz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    await client.connect();
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //photo gallery collection code.

    const photoCollection = client.db('portoToys').collection('gallery');
    app.get('/gallery', async(req,res)=>{
        const cursor = photoCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    //photo gallery collection code.

    //website footer collection code.
    const footerCollection = client.db('portoToys').collection('footerInfo');
    app.get('/footer', async(req,res)=>{
        const cursor = footerCollection.find();
        const result = await cursor.toArray();
        res.send(result);

    })

    //website footer collection code.

    //all toys collection code.
    const toysCollection = client.db('toysDb').collection('toys');

    //all toys collection code.

    //get toy data.
    app.get('/toys', async(req, res)=>{
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //get toy data.

    //post toy data from client to server.
    app.post('/toys', async(req, res)=>{
      const newToys = req.body;
      console.log(newToys);
      const result = await toysCollection.insertOne(newToys);
      res.send(result);
    })

    //post toy data from client to server.

    //toy update code 

    app.get('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query);
      res.send(result);
    })

    app.put('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedToy = req.body;
      const updatedToyInformation = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          message: updatedToy.message
        }
      }

      const result = await toysCollection.updateOne(filter,updatedToyInformation, options);
      res.send(result);

    })
    //toy update code 
    //delete single data from database code.

    app.delete('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query);
      res.send(result);

    })
    //delete single data from database code.

    //loade data based on user email

    app.get('/mytoys', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })
    //loade data based on user email
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('server is running now')
})

app.listen(port, ()=>{
    console.log(port);
})