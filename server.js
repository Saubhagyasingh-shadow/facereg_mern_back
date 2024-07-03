// import { v2 as cloudinary } from 'cloudinary'
const express = require("express");
const bodyParser = require("body-parser"); // Require body-parser

const app = express();
const path = require("path");
const fileupload= require('express-fileupload')
const hbs = require('express-handlebars');

// //for cloudinary
// const cloudinary = require('cloudinary').v2;
// //this is cloudinary config
// cloudinary.config({ 
//     cloud_name: 'dhadmzvzt', 
//     api_key: '136562861254861', 
//     api_secret: 'dMMZu2VvDo9JcCKONJs-HWfIEnU'
//   });




app.use(express.json());
// Set maximum payload size to 50 MB
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


app.use(express.static(path.join(__dirname, "public")));

require('./server/database/database')();

////for connecting with cloudaniry
app.use(fileupload({
    useTempFiles : true,
}));


// app.set('view engine', 'hbs');
// app.engine('hbs', hbs.engine({
//     extname: 'hbs',
//     defaultView: 'default',
//     layoutsDir: path.join(__dirname, 'views'),
//     partialsDir: path.join(__dirname, 'views/partials')
// }));

app.use('/', require('./server/router/router'));

app.listen(3000, () => {
    console.log("server is running on port 3000");
})
