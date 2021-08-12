'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async function (req, res) {

    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({ email: data.email })
    
    if (clientes_arr.length == 0) {

        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash){
                if (hash) {
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({ data: reg });
                }else{
                    res.status(200).send({ message: 'ErrorServer', data:undefined });
                }
            })
        } else {
            res.status(200).send({ message: 'no hay una contrasena', data:undefined });
        }
        // var reg = await Cliente.create(data);
        // res.status(200).send({ data:reg });
        // console.log(reg)
    } else {
        res.status(200).send({ message: 'el correo ya existe', data:undefined });
    }



    //registro
    
    
    // res.status(200).send({ message: 'hola mundo' });
    res.status(200).send({ message: reg });

}

const login_cliente = async function (req, res) {
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({ email: data.email });

    if (cliente_arr.length == 0) {
        res.status(200).send({ message: 'no se encontro el correo', data:undefined });
    } else {
        let user = cliente_arr[0];
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

const listar_clientes_filtro_admin = async function (req, res) {

    let tipo=req.params['tipo'];
    let filtro = req.params['filtro'];

    console.log(tipo);

    if (tipo == null | tipo == 'null') {
        let reg = await Cliente.find();
        res.status(200).send({ data:reg });
                    
    } else {
        if (tipo == 'apellidos') {
            let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
            res.status(200).send({ data:reg });
        } else if (tipo == 'correo') {
            let reg = await Cliente.find({ email: new RegExp(filtro, 'i') });
            res.status(200).send({ data:reg });
        }
                   
    }

    // console.log(req.user);
    // if (req.user) {
    //     if (req.user.rol=='admin') {
    //         let tipo=req.params['tipo'];
    //         let filtro = req.params['filtro'];

    //         console.log(tipo);

    //         if (tipo == null | tipo == 'null') {
    //             let reg = await Cliente.find();
    //             res.status(200).send({ data:reg });
    //         } else {
    //             if (tipo == 'apellidos') {
    //                 let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
    //                 res.status(200).send({ data:reg });
    //             } else if (tipo == 'correo') {
    //                 let reg = await Cliente.find({ email: new RegExp(filtro, 'i') });
    //                 res.status(200).send({ data:reg });
    //             }
    //         }
    //     } else {
    //         return res.status(500).send({ message: 'NoAccess' });
    //     }
    // } else {
    //     return res.status(500).send({ message: 'NoAccess' });
    // }

    
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin
}