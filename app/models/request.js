var mongoose   = require('mongoose');

var Schema     = mongoose.Schema;

var RequestSchema = new Schema({
    connId: Number,
    timeout: Number,
    active: Boolean,
    createdAt: Date
});

module.exports = mongoose.model('Request', RequestSchema);