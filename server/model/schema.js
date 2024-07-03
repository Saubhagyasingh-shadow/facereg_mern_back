const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    filename: {
        type: String,
        unique: true,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    imageBase64: {
        type: String,
        required: true
    },
    groupIdentifier: {
        type: String, // You can adjust the type based on your requirement
        required: true
    },
    name: {
        type: String, // You can adjust the type based on your requirement
        required: true
    }
});

module.exports = UploadModel = mongoose.model('uploads', uploadSchema);
