const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');

const app = express();

//Se acostumbra get para recibir informacion
app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado:true})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({estado:true}, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            })


        })
});




//Se acostumbra POST para enviar informacion
app.post('/usuario', (req, res) => {

    let body = req.body;
    //nueva instancia del modelo usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'se precisa el nombre'
    //     });
    // } else {
    //     res.json({ body });

    // }
});
//Se acostumbra PUT para modificar informacion

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;//aqui se recibe el parametro
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});
//Se acostumbra DELETE para eliminar informacion

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    //Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {

    let cambiaEstado ={
        estado: false
    }
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true}, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioEliminado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioEliminado
        })
    })
});


module.exports = app;