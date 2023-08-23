const mongoose = require("mongoose")

const ConnectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI, {
            dbName: 'BareBeauty',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database Connection is ready")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = ConnectDB