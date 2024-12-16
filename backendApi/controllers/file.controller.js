const { upload } = require('./../Helpers/helper_functions')
const path = require('path')
const fs = require('fs')

module.exports = {
    upload: (req, res) => {
        upload(req, res, function (err) {
            if (err) {
                return res.status(501).json({ error: err })
            }
            return res.json({ msg: "Uploaded Successfully", file: req.file })
        })
    },

    download: (req, res) => {
        if (req.params.folder1 && req.params.folder2 && req.params.folder3) {
            filepath = path.join(__dirname, "/../") + req.params.folder1 + '/' + req.params.folder2 + '/' + req.params.folder3 + '/' + req.params.filename
        } else {
            filepath = path.join(__dirname, "/../") + (req.params.filename).split('%2F').join('/')
        }
        defaultfilepath = path.join(__dirname, "/../public/uploads") + "/no-image.png"
        if (fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            res.sendFile(defaultfilepath)
        }
    },

    folderDownload: (req, res) => {
        filepath = path.join(__dirname, "/../uploads") + "/" + req.params.folder + "/" + req.params.filename
        defaultfilepath = path.join(__dirname, "/../public/uploads") + "/no-image.png"
        if (fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            res.sendFile(defaultfilepath)
        }
    },

}