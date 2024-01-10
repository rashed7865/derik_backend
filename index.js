const express = require('express');
const config = require('./config/keys');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const mongoose = require('mongoose');
const stripe = require('stripe')(config.stripe_secret);
const morgan = require('morgan');
const cors = require('cors');
const app = express();

/******************************************  MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

/******************************************  MongoDb Connection  ********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));


app.get('/', async (req, res) => {
    res.send("Server is running...");
})

app.post("/create-payment-intent", async (req, res) => {
    const { totalPrice } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(totalPrice) * 100,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

app.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));


