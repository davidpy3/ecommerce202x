 'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_admin= async function (req, res) {

    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email })
    
    if (admin_arr.length == 0) {

        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash){
                if (hash) {
                    data.password = hash;
                    var reg = await Admin.create(data);
                    res.status(200).send({ data: reg });
                }else{
                    res.status(200).send({ message: 'ErrorServer', data:undefined });
                }
            })
        } else {
            res.status(200).send({ message: 'no hay una contrasena', data:undefined });
        }
        // var reg = await cliente.create(data);
        // res.status(200).send({ data:reg });
        // console.log(reg)
    } else {
        res.status(200).send({ message: 'el correo ya existe', data:undefined });
    }

}

const login_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });

    if (admin_arr.length == 0) {
        res.status(200).send({ message: 'no se encontro el correo', data:undefined });
    } else {

        let user = admin_arr[0];
        
        bcrypt.compare(data.password, user.password, async function (error, check) {
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({ message:'la contrasena no coincide', data:undefined });
           }
        });
        // console.log(user);
        // if (user.password == data.email) {
        //     res.status(200).send({ data: user });
        // } else {
        //     res.status(200).send({ message: 'la contrasena coincide', data:undefined });
        // }

        
    }

}


module.exports = {
    registro_admin,
    login_admin
}