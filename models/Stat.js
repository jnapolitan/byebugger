const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Stat = mongoose.model('stats', StatSchema);
