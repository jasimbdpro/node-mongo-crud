const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT;
const URI = process.env.URI;


const app = express()
app.use(cors())
app.use(express.json())



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
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

        // Define your database and collection
        const db = await client.db('organicdb');
        const collection = db.collection('products'); // Replace 'products' with your collection name

        // CRUD operations
        // CRUD operations
        // CRUD operations

        // Create
        app.post('/products', async (req, res) => {
            try {
                const product = req.body; // req.body should contain the JSON data
                if (!product.productName || !product.price) {
                    // Check for required fields
                    return res.status(400).send({ error: 'Product name and price are required' });
                }
                const result = await collection.insertOne(product);
                res.status(201).send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Error inserting product' });
            }
        });
        // Read (Get all products)
        app.get('/products', async (req, res) => {
            try {
                const products = await collection.find({}).toArray();
                res.status(200).send(products);
            } catch (error) {
                res.status(500).send({ error: 'Error fetching products' });
            }
        });

        // Update
        app.put('/products/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedProduct = req.body;
                const result = await collection.updateOne(
                    { _id: new MongoClient.ObjectID(id) },
                    { $set: updatedProduct }
                );
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Error updating product' });
            }
        });

        // Delete
        app.delete('/products/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await collection.deleteOne({ _id: new MongoClient.ObjectID(id) });
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Error deleting product' });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("organicdb").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(PORT, () => {
    console.log(`Server is started on port: ${PORT}`)
})