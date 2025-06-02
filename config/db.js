const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGO_URI  = "mongodb+srv://manofiron786:qJvzuFqantuNjbj5@gyaat.tyyymwu.mongodb.net/"

    // manofiron786  qJvzuFqantuNjbj5
    // qJvzuFqantuNjbj5
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;
