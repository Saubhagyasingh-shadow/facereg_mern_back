const route = require('express').Router()
const controller = require('../controller/controller');
const { upload, imageProcessingMiddleware } = require('../middleware/multer');

// routes
route.get('/getter', controller.home);
route.get('/loginimage', controller.home);

route.post('/uploadmultiple', upload.array('images', 3) , controller.uploads)
route.delete('/deleteall', controller.deleteAllData);
route.post('/uploadmultiplenew', controller.newuploads)
route.post('/loginupload', controller.newuploadsLogin)

module.exports = route;