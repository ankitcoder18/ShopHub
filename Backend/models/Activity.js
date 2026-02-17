const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    method: { type: String },
    path: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    statusCode: { type: Number },
    meta: { type: Object },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
