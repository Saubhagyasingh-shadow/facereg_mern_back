const UploadModel = require('../model/schema');
const fs = require('fs');
//for cloudinary
const cloudinary = require('cloudinary').v2;
//this is cloudinary config
cloudinary.config({ 
    cloud_name: 'dhadmzvzt', 
    api_key: '136562861254861', 
    api_secret: 'dMMZu2VvDo9JcCKONJs-HWfIEnU'
  });

exports.home = async (req, res) => {
    try {
        const groupId = req.query.groupId; // Get the group identifier from the request query parameters
        const all_images = await UploadModel.find({ groupIdentifier: groupId }); // Query based on the group identifier
        res.json({ images: all_images });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.uploads = (req, res , next) => {
//     // console.log(req);
//     const files = req.files;

//     console.log("hellllllllo");

//     console.log(files);
//     console.log("---------------------")
//     if(!files){
//         const error = new Error('Please choose files');
//         error.httpStatusCode = 400;
//         return next(error)
//     }

//     // convert images into base64 encoding
//     let imgArray = files.map((file) => {
//         let img = fs.readFileSync(file.path)

//         return encode_image = img.toString('base64')
//     })

//     let result = imgArray.map((src, index) => {

//         // create object to store data in the collection
//         let finalImg = {
//             filename : files[index].originalname,
//             contentType : files[index].mimetype,
//             imageBase64 : src,
//             groupIdentifier: 'your_group_identifier_value_here' // Specify your group identifier value here

//         }

//         let newUpload = new UploadModel(finalImg);

//         return newUpload
//                 .save()
//                 .then(() => {
//                     return { msg : `${files[index].originalname} Uploaded Successfully...!`}
//                 })
//                 .catch(error =>{
//                     if(error){
//                         if(error.name === 'MongoError' && error.code === 11000){
//                             return Promise.reject({ error : `Duplicate ${files[index].originalname}. File Already exists! `});
//                         }
//                         return Promise.reject({ error : error.message || `Cannot Upload ${files[index].originalname} Something Missing!`})
//                     }
//                 })
//     });

//     Promise.all(result)
//     .then(messages => {
//         res.json({ success: true, message: messages });
//     })
//     .catch(err => {
//         res.status(500).json({ success: false, error: err.message });
//     });
// }


exports.uploads = (req, res, next) => {
    const files = req.files;
    const groupId = req.body.groupId; // Assuming the classifier value is sent in the request body
    console.log("hellllllllo");

        console.log(files);
        console.log("grp id",groupId)
        console.log("---------------------")
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }

    // Convert images into base64 encoding
    let imgArray = files.map((file) => {
        let img = fs.readFileSync(file.path);
        return img.toString('base64');
    });

    let result = imgArray.map((src, index) => {
        // Create object to store data in the collection
        let finalImg = {
            filename: files[index].originalname,
            contentType: files[index].mimetype,
            imageBase64: src,
            groupIdentifier: groupId, // Set the groupIdentifier to the classifier value,
            name:files[index].originalname
        };

        let newUpload = new UploadModel(finalImg);

        return newUpload
            .save()
            .then(() => {
                return { msg: `${files[index].originalname} Uploaded Successfully...!` };
            })
            .catch(error => {
                if (error) {
                    if (error.name === 'MongoError' && error.code === 11000) {
                        return Promise.reject({ error: `Duplicate ${files[index].originalname}. File Already exists! ` });
                    }
                    return Promise.reject({ error: error.message || `Cannot Upload ${files[index].originalname} Something Missing!` });
                }
            });
    });

    Promise.all(result)
        .then(messages => {
            res.json({ success: true, message: messages });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err.message });
        });
};

exports.deleteAllData= (req, res) => {
    // Implement logic to delete all data from your database
    // For example, if you're using Mongoose, you can do:
    UploadModel.deleteMany({})
    .then(() => {
      res.json({ message: 'All data deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete data' });
    });

    // Replace `YourModel` with your actual database model and adapt the logic as per your database library
  }



//   exports.newuploads = (req, res) =>{
//     const file = req.files.images;
//     const groupId = req.body.groupId; // Assuming the classifier value is sent in the request body
//     console.log("hellllllllo");

//         console.log(files);
//         console.log("grp id",groupId)
//         console.log("---------------------")

//     if (!file) {
//         const error = new Error('Please choose files');
//         error.httpStatusCode = 400;
//         return next(error);
//     }
//     cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ success: false, error: 'Failed to upload image to Cloudinary' });
//         }
//         // Handle successful upload
//         console.log(result);
//         res.json({ success: true, message: 'Image uploaded to Cloudinary successfully', data: result });
//     });

// }

exports.newuploads = (req, res, next) => {
    const files = req.files.images; // Assuming 'images' is the name of the input field for images
    const groupId = req.body.groupId; // Assuming the classifier value is sent in the request body
    console.log(groupId);
    if (!files || !Array.isArray(files)) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    // Save details to database
                    const finalImg = {
                        filename: result.url, // Set filename to Cloudinary URL
                        contentType: result.type, // Set contentType to the type returned by Cloudinary
                        imageBase64: result.secure_url, // Set imageBase64 to the secure_url returned by Cloudinary
                        groupIdentifier:groupId,
                        name:result.original_filename
                    };
                    console.log("hello");
                      console.log(finalImg)
                    console.log("-----------------------")
                    const newUpload = new UploadModel(finalImg);
                    newUpload.save()
                        .then(() => {
                            resolve({ msg: `${file.name} Uploaded Successfully...!` });
                        })
                        .catch(error => {
                            if (error.name === 'MongoError' && error.code === 11000) {
                                reject({ error: `Duplicate ${file.originalname}. File Already exists!` });
                            } else {
                                reject({ error: error.message || `Cannot Upload ${file.originalname} Something Missing!` });
                            }
                        });
                }
            });
        });
    });

    Promise.all(uploadPromises)
        .then(messages => {
            res.json({ success: true, message: messages });
        })
        .catch(err => {
            console.error(err);

            res.status(500).json({ success: false, error: err.message });
        });
};

exports.newuploadsLogin = (req, res, next) => {
    const files = req.files.images; // Assuming 'images' is the name of the input field for images
    const groupId = req.body.groupId; // Assuming the classifier value is sent in the request body
    console.log(groupId);
    if (!files || !Array.isArray(files)) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }

    // Process only the first file
    const file = files[0];
    
    // Create a promise to upload the first file
    const uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                // Save details to database
                const finalImg = {
                    filename: result.url, // Set filename to Cloudinary URL
                    contentType: result.type, // Set contentType to the type returned by Cloudinary
                    imageBase64: result.secure_url, // Set imageBase64 to the secure_url returned by Cloudinary
                    groupIdentifier:groupId,
                    name:result.original_filename
                };
                console.log("hello");
                console.log(finalImg);
                console.log("-----------------------");
                const newUpload = new UploadModel(finalImg);
                newUpload.save()
                    .then(() => {
                        resolve({ msg: `${file.name} Uploaded Successfully...!` });
                    })
                    .catch(error => {
                        if (error.name === 'MongoError' && error.code === 11000) {
                            reject({ error: `Duplicate ${file.originalname}. File Already exists!` });
                        } else {
                            reject({ error: error.message || `Cannot Upload ${file.originalname} Something Missing!` });
                        }
                    });
            }
        });
    });

    // Resolve the upload promise
    uploadPromise
        .then(message => {
            res.json({ success: true, message: message });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, error: err.message });
        });
};
