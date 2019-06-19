
/*======================================
 * PUERTO
 ======================================*/
 process.env.PORT = process.env.PORT || 3000;

/*======================================
 * Entorno
 ======================================*/
 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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
