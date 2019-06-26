const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');



/*******************************
 * Obtener Productos
 *********************************/


app.get('/producto',verificaToken,(req,res)=>{

	let desde = req.query.desde || 0;
	desde = Number(desde);

	Producto.find({disponible:true})
	.skip(desde)
	.limit(5)
	.sort('descripcion')
    .populate('usuario','nombre email')
    .populate('categoria','descripcion')
	.exec((err,productos)=>{
		 if (err) {
            return res.status(500).json({
                ok: false,
               

                err
            });
        }   
        

        res.json({
            ok:true,
            productos
        });
	})

});

/************************************
 * Obtener producto por ID
 ************************************/
app.get('/producto/:id',verificaToken,(req,res)=>{

	let id = req.params.id;
	Producto.findById(id)
		.populate('usuario','nombre email')
		.populate('categoria','nombre')
		.exec((err,productoDB)=>{

		 if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }  
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                	message: 'id no existe'
                }
            });
        }   
        

        res.json({
            ok:true,
            producto: productoDB
        });
	});
	});	

/************************************
 * Buscar productos
 ************************************/
app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{


	let termino = req.params.termino;

	let regEx = new RegExp(termino,'i');



	Producto.find({nombre:regEx})
		.populate('categoria','nombre')
		.exec((err,productos)=>{
			if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }   
        

        res.json({
            ok:true,
            productos
        });
		})





})




 /*==================================
  * Crear Producto
  ===================================*/
 app.post('/producto', verificaToken, (req, res) => {
	//1-recuperar lo enviado por el post   
    let body = req.body; //obtener el body 
    //2-crear instancia del objeto producto (Modelo)
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    //3-Guardar el producto
    producto.save((err, productoDB)=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

   /* if (!productoDB) {
        return res.status(400).json({
            ok: false,
            err
        });
    }*/

    res.json({
        ok: true,
        producto: productoDB
    });

});
});


/*
 * Actualizar el producto
 */

app.put('/producto/:id',verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    /*let descProducto = {
        descripcion: body.descripcion
    };*/


    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                	message: 'el producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre,
        productoDB.precioUni = body.precioUni,
        productoDB.descripcion = body.descripcion,
        productoDB.disponible = body.disponible,
        productoDB.categoria = body.categoria


        productoDB.save((err,productoGuardado)=>{
        	if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoGuardado
        });


        });


    });
});


app.delete('/producto/:id', verificaToken,(req, res) => {

    let id = req.params.id;

    //Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {

    let cambiaEstado ={
        disponible: false
    }
    Producto.findByIdAndUpdate(id,cambiaEstado,(err, productoEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err:{
                	message: 'producto no existe'
                }
            });
        }
        if (productoEliminado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoEliminado
        })
    })
});


















module.exports = app;