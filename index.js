const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT;
const URI = process.env.URI;


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Define your database and collection
        const db = await client.db('organicdb');
        const productCollection = db.collection('products'); // Replace 'products' with your collection name

        // CRUD operations
        // CRUD operations
        // CRUD operations
        // Read (Get all products)
        app.get('/products', async (req, res) => {
            try {
                const products = await productCollection.find({}).toArray(); // Fetch all products as an array
                res.status(200).send(products); // Send the products with a 200 status
            } catch (err) {
                console.error('Error fetching products:', err); // Log the error for debugging
                res.status(500).send({ error: 'Error fetching products' }); // Send an error response with a 500 status
            }
        });



        // Create
        app.post('/addProduct', (req, res) => {

            const product = req.body; // req.body should contain the JSON data
            console.log(product)
            productCollection.insertOne(product)
                .then(result => {
                    console.log('data added successfully')
                    res.status(200).send("Success")
                })

        });

        app.delete('/delete/:id', (req, res) => {
            //Class constructor ObjectId cannot be invoked without 'new'
            productCollection.deleteOne({ _id: new ObjectId(req.params.id) })
                .then(result => {
                    console.log(result)

                })
        })


        // Update
        app.put('/products/:id', async (req, res) => {
            try {
                const id = req.params.id;

                // Check if the ID is a valid ObjectId
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ error: 'Invalid product ID format' });
                }

                const updatedProduct = req.body;

                // Convert id string to MongoDB ObjectId
                const result = await productCollection.updateOne(
                    { _id: new ObjectId(id) }, // Use ObjectId here
                    { $set: updatedProduct }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send({ error: 'Product not found' });
                }

                res.status(200).send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Error updating product' });
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