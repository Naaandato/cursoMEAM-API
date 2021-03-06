'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
       message: 'prueba de accion de contolador de usuarios'
    });
}


function saveUser(req, res){
    var user = new User();

    var params = req.body;

    //console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //encriptar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                // guardar usuario bd
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message: 'Error al guardar usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Introduce todos los campos'});
            }
        });

    }else{
        res.status(200).send({message: 'Introduce contraseña'});
    }

}

function loginUser(req, res){

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else {
            if (!user) {
                res.status(404).send({message: 'El usuario no existe'});
            } else {
                //comprobar la contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //devolver datos usuario logueado
                        if (params.gethash) {
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });

            }
        }
    });
}


function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var fileName = 'No subido...';

    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('/');
        fileName = fileSplit[2];
        var fileExt = fileName.split('.')[1];

        console.log(fileExt);

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){

            User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({image: fileName, user: userUpdated});
                    }
                }
            });

        }else{
            res.status(200).send({message: 'Extension del archivo no valida'});
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen'});
    }
}


function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/'+imageFile;

    fs.exists(pathFile, function (exists) {
        if(exists){
            res.sendFile(path.resolve(pathFile))
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });

}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};