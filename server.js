const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require("path");
const fileupload = require('express-fileupload');
const hbs = require('express-handlebars');

const app = express();

// Enable CORS for all origins
app.use(cors());

// For Cloudinary (commented out sections, if needed, can be uncommented)
// const cloudinary = require('cloudinary').v2;
// cloudinary.config({ 
//     cloud_name: 'dhadmzvzt', 
//     api_key: '136562861254861', 
//     api_secret: 'dMMZu2VvDo9JcCKONJs-HWfIEnU'
// });

app.use(express.json());
// Set maximum payload size to 100 MB
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(express.static(path.join(__dirname, "public")));

require('./server/database/database')();

// For connecting with Cloudinary
app.use(fileupload({
    useTempFiles: true,
}));

// View engine setup (if needed)
// app.set('view engine', 'hbs');
// app.engine('hbs', hbs.engine({
//     extname: 'hbs',
//     defaultView: 'default',
//     layoutsDir: path.join(__dirname, 'views'),
//     partialsDir: path.join(__dirname, 'views/partials')
// }));

app.use('/', require('./server/router/router'));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
