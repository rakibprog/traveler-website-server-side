const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
const ObjectId = require('mongodb').ObjectId;
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umjp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('travelerDB');
        const service = database.collection('travelerService');
        const booking = database.collection('travelerBooking');
        //service GET API
        app.get('/travelerService', async(req, res) => {
            const serviceCursors = service.find({});
            const services = await serviceCursors.toArray();
            res.json(services);
        });

        //product All loop API
        app.get('/travelerBooking', async(req, res) => {
            const bookingg = await booking.find({}).toArray();
            res.json(bookingg);
        });
        //Service POST API
        app.post('/travelerService', async(req, res) => {
            const newService = req.body;
            const result = await service.insertOne(newService);
            res.json(result)
        })

        // Booking POST API 
        app.post('/travelerBooking', async(req, res) => {
                const newBooking = req.body;
                const bookingResult = await booking.insertOne(newBooking);
                res.json(bookingResult)
            })
            //Delete API
        app.delete('/travelerBooking/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booking.deleteOne(query);
            res.json(result);
        });

        //My order APi 
        app.get('/travelerBooking/:email', async(req, res) => {
            const myUser = req.params;
            const query = { email: myUser.email };
            const result = await booking.find(query).toArray();
            res.json(result);
        });


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})