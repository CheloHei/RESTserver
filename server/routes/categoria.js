const express = require('express');

let { verificaToken, verificaRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

/**
 * Mostar todas las categorias
 */
app.get('/categoria', (req, res) => {
    

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err,categorias)=>{

    if (err) {
            return res.status(500).json({
                ok: false,
               

                err
            });
        }   
        

        res.json({
            ok:true,
            categorias
        });

    });
});
/**
 * Mostrar categoria por ID
 */
app.get('/categoria/:id',verificaToken, (req, res) => {
    //categoria.findById

    let id = req.params.id;
     Categoria.findById(id,(err,categoriaDB)=>{

    
    if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }   

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El id no es correcto'
                }
            });
        }   
        
        

        res.json({
            ok:true,
            categoria: categoriaDB
        });

    });


});
/**
 * Crear nueva categoria
 */
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario_id

    let body = req.body; //obtener el body 

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!categoriaDB) {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    res.json({
        ok: true,
        categoria: categoriaDB
    });

});
});
/**
 * Modificar las categorias
 */
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * Eliminar la categoria
 */
app.delete('/categoria/:id',[verificaToken,verificaRole],(req, res) => {
    //solo el admin puede borrar categorias
    //Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            message: 'categoria eliminada'
            //categoria: categoriaDB
        });
    })
});










module.exports = app;