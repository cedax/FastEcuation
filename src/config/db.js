const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const uri = "mongodb+srv://Sedax:xYuRhr1wIYT6zwvY@cluster0.9zixm.mongodb.net/fastecuation?retryWrites=true&w=majority";

module.exports = () => {
    const connect = () => {
        mongoose.connect(
            uri,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) => {
                if (err) {
                    console.log('MongoDB connection error', err);
                } else {
                    console.log('MongoDB connected');
                }
            }
        );
    }

    connect();
}