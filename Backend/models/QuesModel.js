const mongoose = require("mongoose");

const quesSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userQues: {
        type: String,
        required: true,
    },
    userImg:{
        type: String,
        default: "https://img.freepik.com/premium-vector/female-user-profile-avatar-is-woman-character-screen-saver-with-emotions_505620-617.jpg?w=2000"
    },
    Answer: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            userAnswer: {
                type: String,
                required: true,
            },
            userImg:{
                type: String,
                default: "https://img.freepik.com/premium-vector/female-user-profile-avatar-is-woman-character-screen-saver-with-emotions_505620-617.jpg?w=2000"
            },

            time: {
                type: Date,
                default: Date.now()
            },

        },
    ],

})

module.exports = mongoose.model("Question", quesSchema);