
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
process.env.CADUCIDAD_TOKEN = 60*60*24*30;



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
