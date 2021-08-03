const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
<<<<<<< HEAD
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
=======
    rating: Number
>>>>>>> 30c81d8fafe91a2d550add2acfdb35985d8b1741
})

module.exports = mongoose.model("Review", reviewSchema);