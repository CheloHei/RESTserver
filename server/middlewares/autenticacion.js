const jwt = require('jsonwebtoken');




//======================
// Verificar Token
//======================

let verificaToken = (req,res,next)=>{

	let token = req.get('token');

	jwt.verify(token, process.env.SEED,(err,decoded)=>{

		if (err) {

			return res.status(401).json({
				ok: true,
				err:{
					message: 'Debe ser proveido el Token'
				}
			});
		}


		req.usuario = decoded.usuario;

		next();

	});

};

//======================
// Verificar AdminRole
//======================

let verificaRole = (req,res,next)=>{

	let usuario = req.usuario;


	

		if (usuario.role === 'ADMIN_ROLE') {

			next();
			
		}else{
			return res.json({
				ok: true,
				err:{
					message: 'El usuario debe ser administrador'
				}
			});
		}

		

	

};



module.exports = {
	verificaToken,
	verificaRole
}