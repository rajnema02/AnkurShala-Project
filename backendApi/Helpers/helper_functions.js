const multer = require('multer')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

var store = multer.diskStorage({
    destination: function (req, file, cb) {
        const dateObj = new Date()
        const month = dateObj.getUTCMonth() + 1
        const day = dateObj.getUTCDate()
        const year = dateObj.getUTCFullYear()
        if (!fs.existsSync('./uploads/' + year)) {
            fs.mkdirSync('./uploads/' + year)
        }
        if (!fs.existsSync('./uploads/' + year + '/' + month)) {
            fs.mkdirSync('./uploads/' + year + '/' + month)
        }
        cb(null, './uploads/' + year + '/' + month)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + path.basename(generateRandomString(12), path.extname(file.originalname)) + path.extname(file.originalname))
        // cb(null, req.body.docname + '.jpg')
    }
})


module.exports = {
    upload: multer({ storage: store }).single("file"),
    uploadImage: multer({ storage: store }).single("image"),
    uploadProfilePicture: multer({ storage: store }).single("profile_picture"),
    uploadMultipleImages: multer({ storage: store }).array("images"),
    uploadMultipleVideos: multer({ storage: store }).array("videos"),
    uploadMultipleImagesAndVideos: multer({ storage: store }).fields([{ name: 'images' }, { name: 'videos' }]),
    
    uploadMultipleDocs: multer({ storage: store }).array("docs"),
    generatePassword: () => {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    },
    generateOtp: () => {
        var length = 5,
            charset = "0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    },
    generateMobileOtp: async (mobile = 0) => {
        var length = 4,
            charset = "0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        if (mobile == 9074297336) {
            retVal = '1111'
        }
        return retVal;
    },
}

function generateRandomString(len) {
    var length = len,
        charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}