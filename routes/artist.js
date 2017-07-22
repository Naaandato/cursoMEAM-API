'use strict'

var express = require('express');
var ArtistControler = require('../controllers/artist');

var api = express.Router();
var md_auth = require('../middlewares/autheticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists'});

api.post('/save-artist', md_auth.ensureAuth, ArtistControler.saveArtist);
api.get('/get-artist/:id', md_auth.ensureAuth, ArtistControler.getArtist);
api.get('/get-artists/:page?', md_auth.ensureAuth, ArtistControler.getArtists);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistControler.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistControler.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistControler.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistControler.getImageFile);


module.exports = api;