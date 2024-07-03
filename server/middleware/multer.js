const multer = require('multer');
const sharp = require('sharp'); // Import Sharp for image processing

// Set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }
});

// Multer middleware configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Set maximum file size to 10 MB
});

// Image processing middleware to resize and compress images before saving
const imageProcessingMiddleware = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    // Process each uploaded image
    Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize({ width: 800 }) // Resize the image to a maximum width of 800px
            .toFormat('jpeg') // Convert the image to JPEG format
            .jpeg({ quality: 80 }) // Set JPEG quality to 80%
            .toFile(`${file.path}-optimized`); // Save the optimized image

        // Replace the original file path with the path of the optimized image
        file.path = `${file.path}-optimized`;
    }))
        .then(() => next())
        .catch((error) => next(error));
};

module.exports = { upload, imageProcessingMiddleware };
