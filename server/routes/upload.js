const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const fs = require('fs');
const path = require('path');

//opciones por defecto
app.use(fileUpload());
/*
 * PETICION PARA SUBIR ARCHIVOS 
 */

app.put('/upload/:tipo/:id', function (req, res) {

	let tipo = req.params.tipo;
	let id = req.params.id;



	if (!req.files) {

		return res.status(400)
		json({
			ok: false,
			err: {
				message: 'No se ha seleccionado ningun archivo'
			}
		})

	}

	//Validar tipo

	let tiposValidos = ['productos', 'usuarios'];

	if (tiposValidos.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
			}
		})
	}




	//let pathImagen = path.resolve(__dirname, '../../uploads/usuarios/${}');


	let archivo = req.files.archivo;

	//Extensiones permitidas
	let extensionesVal = ['png', 'jpg', 'gif', 'jpeg'];

	let nombreCortado = archivo.name.split('.');


	let extension = nombreCortado[nombreCortado.length - 1];


	if (extensionesVal.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Las extensiones validas son ' + extensionesVal.join(','),
				recibido: extension
			}
		})
	}

	//Cambiar nombre al archivo
	let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;




	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
		if (err)
			return res.status(500).json({
				ok: false,
				err
			});

		//Imagen cargada 
		if (tipo === 'usuarios') {
			imagenUsuario(id, res, nombreArchivo);

		}else{

			imagenProducto(id, res, nombreArchivo);
		}



	});
});
/*=========================================================
 *============= FUNCION PARA SUBIR LA IMAGEN DEL USUARIO 
 ===========================================================*/
function imagenUsuario(id, res, nombreArchivo) {
	Usuario.findById(id, (err, usuarioDB) => {
		if (err) {
			borrarArchivo(nombreArchivo,'usuarios');
			return res.status(500).json({
				ok: false,
				err
			})
		}


		if (!usuarioDB) {
			borrarArchivo(nombreArchivo,'usuarios');

			return res.status(500).json({
				ok: false,
				err: {
					message: 'usuario no existe'
				}
			});
		}


		borrarArchivo(usuarioDB.img,'usuarios')
		


		usuarioDB.img = nombreArchivo;

		usuarioDB.save((err, usuarioDB) => {
			res.json({
				ok: true,
				usuario: usuarioDB,
				img: nombreArchivo
			});
		});




	})
}

/*==============================================================
 *============= FUNCION PARA SUBIR LA IMAGEN DEL PRODUCTO 
 ==============================================================*/
function imagenProducto(id, res, nombreArchivo){

Producto.findById(id, (err, productoDB) => {
		if (err) {
			borrarArchivo(nombreArchivo,'productos');
			return res.status(500).json({
				ok: false,
				err
			})
		}


		if (!productoDB) {
			borrarArchivo(nombreArchivo,'productos');

			return res.status(500).json({
				ok: false,
				err: {
					message: 'producto no existe'
				}
			});
		}


		borrarArchivo(productoDB.img,'productos')
		


		productoDB.img = nombreArchivo;

		productoDB.save((err, productoGurdado) => {
			res.json({
				ok: true,
				producto: productoGurdado,
				img: nombreArchivo
			});
		});




	})

}


/*=================================================================
 * FUNCION QUE PERMITE BORRAR ARCHIVOS REPETIDOS QUE YA SE SUBIERON
 =================================================================*/

function borrarArchivo(nombreImagen,tipo){
	let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
	console.log(pathImagen);

		if (fs.existsSync(pathImagen)) {
			fs.unlinkSync(pathImagen);
		}
}
/*===================================================
 * EXPORTACION DE MODULOS PRINCIPALES
 ====================================================*/
module.exports = app;