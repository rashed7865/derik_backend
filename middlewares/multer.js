// const cloudinary = require('cloudinary').v2;
// const config = require('../config/keys');
// const formidable = require('formidable');

// cloudinary.config({
//     cloud_name: config.cloudinary_cloud_name,
//     api_key: config.cloudinary_api_key,
//     api_secret: config.cloudinary_api_secret
// });

// const uploadFile = async (req, res, next) => {
//     try {
//         const form = new formidable.IncomingForm();
//         const nonFileParts = {};
//         let pictureUploaded = "";

//         form.onPart = function (part) {
//             if (part.name === "file") {
//                 pictureUploaded = "true";
//                 // Handle file uploads
//                 const uniqueFileName = Date.now() + '-' + part.originalFilename;
//                 // Use the direct upload feature to upload the file to Cloudinary
//                 const uploadStream = cloudinary.uploader.upload_stream(
//                     { folder: 'Dêrik-online-shopRA/Product', public_id: uniqueFileName },
//                     (error, result) => {
//                         console.log(error, result)
//                         if (error) {
//                             console.error('Error uploading file to Cloudinary:', error);
//                         }

//                         req.body.productPicture = {
//                             url: result.secure_url,
//                             id: result.public_id,
//                         };
//                         pictureUploaded = "false";
//                     }
//                 );
//                 part.pipe(uploadStream);

//             } else {
//                 if (pictureUploaded === "true") {

//                 }

//                 else if (pictureUploaded === "false") {
//                     pictureUploaded = "done";
//                     // Handle non-file parts
//                     nonFileParts[part.name] = '';
//                     part.on('data', function (data) {
//                         nonFileParts[part.name] += data;
//                     });
//                 } else {
//                     // Handle non-file parts
//                     nonFileParts[part.name] = '';
//                     part.on('data', function (data) {
//                         nonFileParts[part.name] += data;
//                     });
//                 }
//             }
//         };

//         console.log(pictureUploaded)

//         form.on('end', function () {
//             console.log(req.body);
//             Object.assign(req.body, nonFileParts);
//             // Set the non-file parts in req.body
//             if (pictureUploaded === "false") {
//                 pictureUploaded = ""
//                 next();
//             }

//             if (pictureUploaded === "done") {
//                 Object.assign(req.body, nonFileParts);
//                 pictureUploaded = ""
//                 next();
//             }
//         });
//         form.parse(req);
//     } catch (error) {
//         console.log(error);
//     }
// };

// module.exports = uploadFile;




const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;