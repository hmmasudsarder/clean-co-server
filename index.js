const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
var cookieParser = require('cookie-parser');
const port = 5000;

const secret = "verynicenicevery";
// Password 
// clean-co
// XIi6IPRmx5IIajx7

app.use(express.json());
app.use(cookieParser());

// momgoURL
const uri = "mongodb+srv://clean-co:XIi6IPRmx5IIajx7@cluster0.suyjuyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const servicesCollection = client.db("clean-co").collection("services");
    const bookingCollection = client.db("clean-co").collection("booking");


    const verify = (req, res, next) => {
      const {token} = req.cookies;
      if(!token){
        return res.status(401).send({message: "Your Are not Authorized"})
      }
      jwt.verify(token, secret, function(err, decoded){
        if(err){
          return  res.status(401).send({message: "Your Are not Authorized"})
        }
        console.log(decoded);
      })
    }

    app.get('/api/v1/services', verify, async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result)
    })

    app.post("/api/v1/user/create-booking", async(req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

    app.post("/api/v1/access-token", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, secret);
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: "none"
      }).send({ success: true })
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})