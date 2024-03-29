
/*======================================
 * PUERTO
 ======================================*/
 process.env.PORT = process.env.PORT || 3000;




/*======================================
 * Entorno
 ======================================*/
 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
 


 /*======================================
 * Vencimiento del Token
 ======================================*/
// 60segundos
// 60 minutos
// 24 horas	
// 30 dias
//process.env.CADUCIDAD_TOKEN = 60*60*24*30;
process.env.CADUCIDAD_TOKEN = '48h';



/*======================================
 * SEED de autenticacion
 ======================================*/
process.env.SEED = 'secreto';
/*======================================
 * DB
 ======================================*/
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

}else{
    urlDB = 'mongodb+srv://cafe-user:cafe-user123456@cluster0-fz0az.mongodb.net/test?retryWrites=true&w=majority'
}


process.env.URLDB = urlDB;

/*======================================
 * GOOGLE CLIENT ID
 ======================================*/

 process.env.CLIENT_ID = process.env.CLIENT_ID = '468680015655-ibaclatd0rfksvc4hj54k8st3s31863c.apps.googleusercontent.com';