const multer = require('multer');
const path = require('path');

console.log('inside profilePicture.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('[MULTER] destination hit');
        cb(null, 'profilePictures/');
    },
    filename: (req, file, cb) => {
        const uniqueName = req.user._id + '';
        cb(null, uniqueName);
    }
});

const profilePicture = multer({ storage: storage });

module.exports = profilePicture;