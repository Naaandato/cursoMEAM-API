'use strict'

var mongoose = require('mongoose');
var app = require('./app.js');
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/cursoMEAN', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Database connection OK");

        app.listen(port, function(){
            console.log("Server listening in port:" + port);
        });
    }
});



