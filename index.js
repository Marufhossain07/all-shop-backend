const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://all-shop-1760b.web.app",
            "https://all-shop-1760b.firebaseapp.com"
        ]
    })
);
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vo0jwvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
        await client.connect();

        const productCollection = client.db('allshopDB').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page) - 1
            const size = parseInt(req.query.size)
            const search = req.query.search;
            const date = req.query.date;
            const max = parseFloat(req.query.max)
            const price = req.query.price;
            const brand = req.query.brand;
            const category = req.query.category;
            const query = {}
            const options = {}

            if (search) {
                query.name = { $regex: search, $options: 'i' }
            }
            if (brand) {
                query.brand = brand
            }

            if (category) {
                query.category = category
            }
            
            if (max) {
                query.price = { $lte: max }
            }
            
            if (date) {
                options.sort = {
                    "createdAt": 1
                }
            }
            else if (price && price === 'low') {
                options.sort = {
                    "price": 1
                }
            }
            else if (price && price === 'high') {
                options.sort = {
                    "price": -1
                }
            }


            const result = await productCollection.find(query, options).skip(page * size).limit(size).toArray();
            res.send(result)
        })

        app.get('/products-count', async (req, res) => {
            const result = await productCollection.countDocuments()
            res.send({ result })
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
    res.send('server is running very high')
})

app.listen(port, () => {
    console.log('the server is running man');
})