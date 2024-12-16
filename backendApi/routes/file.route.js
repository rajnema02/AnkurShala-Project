const express = require("express");
const _router = express.Router();
const FileController = require('../controllers/file.controller')
const { verifyAccessToken } = require('../Helpers/jwt_helper')

_router.post("/upload", FileController.upload);

_router.get("/download/:filename", FileController.download);

_router.get("/download/:folder1/:folder2/:folder3/:filename", FileController.download);

_router.get("/download/:folder/:filename", FileController.folderDownload);

module.exports = _router;
