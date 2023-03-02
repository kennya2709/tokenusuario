const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const fileUpload = require('express-fileupload');
var jwt = require('jsonwebtoken');
const app = express();
const port = 5000;
app.use(fileUpload());

const bcrypt = require('bcrypt');
const saltRounds = 10;

const path = require('path');

// const db = mysql.createPool({
//  host: "localhost",
//  user: "tutorias_user",
//  password: "b)G6GPq)ZcqCtmP!",
//  database: "tutorias",
// });

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tutorias",
});

app.use(bodyParser.json());
app.use(cors());

// app.use(express.static('imagenes')); // https://expressjs.com/es/starter/static-files.html
app.use('/img', express.static(__dirname + '/imagenes'));
app.get('/', (req, res) => {
  res.send('Bienvenido a node js')
});

const verificarToken = (req, res, next) => {
    // console.log('aqui');
    const token = req.headers["x-access-token"] ? req.headers["x-access-token"] : '';
    jwt.verify(token, 'jwtSecret', (err,decoded)=>{
        if(!err) {
            req.auth = true;
            req.matricula = decoded.matricula;
            req.nombre = decoded.nombre;
            req.aPaterno = decoded.aPaterno;
            req.aMaternofoto = decoded.aMaterno;
            req.permisos = decoded.permisos;
            next();
        }else {
            res.send({
                status:100,
                auth:false,
                resultado:err,
            })
        }
    });
}



// agregar alumno
app.post('/alumno/agregar', (req, res) => {
    const { matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, tipoSangre, nombreContacto, telefonoContacto, contrasenha } = req.body;
   
    const sql = "INSERT INTO alumnos (matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, tipoSangre, nombreContacto, telefonoContacto, contrasenha) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
   
    bcrypt.hash(contrasenha, saltRounds).then(function(hash) {
        // Store hash in your password DB.
        db.query(sql, [matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, tipoSangre, nombreContacto, telefonoContacto,  hash], (err, result) => {
            //console.log(result);
            if (err) {
              res.send({
                  status:100,
                  errNo: err.errno,
                  mensaje: err.sqlMessage,
                  codigo: err.code,
              });
              //console.log(err.errno);
            } else {
              res.send({
                  status:200,
                  result,
              });
            }
            //console.log("Error", err);
            //console.log("Result", result);
          });
        }).catch((err1)=>{
            res.send({
                status:100,
                errNo: err1.errno,
                mensaje: err1.sqlMessage,
                codigo: err1.code,
            });
        });
    });
   
   
    // traer a todos los alumnos
  app.get('/alumnos', (req, res) =>{
    const sql = "SELECT * FROM alumnos";
    db.query(sql, (err, result, fields) => {
        if(!err) {
            res.send({
                status:200,
                result,
            });
        }else {
            res.send({
                status:100,
                err,
            })

        }
      });
   
  });

  // traer un alumno por medio de la matricula
  app.get('/alumno/traer/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    const sqlGet = "SELECT * FROM alumnos WHERE matricula=?";
    db.query(sqlGet, [matricula], (err, result, fields) => {
        if (err) {
            res.send({
                status:100,
                errNo: err.errno,
                mensaje: err.sqlMessage,
                codigo: err.code,
            });
            //console.log(err.errno);
          } else {
            res.send({
                status:200,
                result,
            });
          }  
    });
  });

  // traer un alumno por medio del token
  app.get('/alumno/traer', verificarToken, (req, res) => {
    // console.log('aqui');
    const { matricula } = req;
    const sqlGet = "SELECT * FROM alumnos WHERE matricula=?";
    db.query(sqlGet, [matricula], (err, result, fields) => {
        if (err) {
            res.send({
                status:100,
                resultado: err,
            });
            //console.log(err.errno);
          } else {
            res.send({
                status:200,
                resultado:{...result[0], ['contrasenha']:''},
            });
          }  
    });
    // console.log(req);
    // res.status(200).send({
    //  matricula:req.matricula,
    //  nombre:req.nombre,
    //  aPaterno:req.aPaterno,
    //  aMaternofoto:req.aMaterno,
    //  permisos:req.permisos,
    // });
    // const {matricula, nombre, aPaterno, aMaterno, foto, permisos} = req;
  });

  app.get('/alumno/verificar', verificarToken, (req, res) => {
    const { auth } = req;
    console.log(auth);
        if (auth) {
            res.send({
                status:201,
                auth,
            });
          } else {
            res.send({
                status:100,
                auth,
            });
    };
   
  });


  // modificar datos de un alumno
  app.post('/alumno/modificar', (req, res)=>{
   
    const { matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram } = req.body;
   
    const sql = "UPDATE alumnos SET aPaterno=?, aMaterno=?, nombre=?, sexo=?, dCalle=?, dNumero=?, dColonia=?, dCodigoPostal=?, aTelefono=?, aCorreo=?, aFacebook=?, aInstagram=? WHERE matricula = ?";
    db.query(sql, [aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, matricula], (err, result) => {
      //console.log(result);
      if (err) {
        res.send({
            status:100,
            errNo: err.errno,
            mensaje: err.sqlMessage,
            codigo: err.code,
        });
        //console.log(err.errno);
      } else {
        res.send({status:200});
      }
      //console.log("Error", err);
      //console.log("Result", result);
    });

  });

  // eliminar a un alumno
  app.post('/alumno/eliminar', (req, res)=>{
   
    const { matricula } = req.body;
   
    const sql = "DELETE FROM alumnos WHERE matricula = ?";
    db.query(sql, [matricula], (err, result) => {
      //console.log(result);
      if (err) {
        res.send({
            status:100,
            errNo: err.errno,
            mensaje: err.sqlMessage,
            codigo: err.code,
        });
        //console.log(err.errno);
      } else {
        res.send({status:200});
      }
      //console.log("Error", err);
      //console.log("Result", result);
    });

  });

  // Acceso a un alumno
  app.post('/alumno/acceder', (req, res)=>{
    const { matricula, contrasenha } = req.body;
    const sql = 'SELECT * FROM alumnos WHERE matricula =?';
    db.query(sql, [matricula], (err,result)=>{
        // console.log(result.length);
        if(err) {
            return (
                res.send({
                    status:403,
                    err,
                    result,
                    resultado: { token:'', auth:false, mensaje:'Problemas de red, contacte al administrador', }
                })
            );
        }
        if(result.length>0) {
            bcrypt.compare(contrasenha, result[0].contrasenha, function(err1, result1) {
                if(result1) {
                    const matricula = result[0].matricula;
                    const nombre = result[0].nombre;
                    const aPaterno = result[0].aPaterno;
                    const aMaterno = result[0].aMaterno;
                    const foto = result[0].foto;
                    const permisos = 'alumno';
                    const token = jwt.sign({matricula, nombre, aPaterno, aMaterno, foto, permisos}, "jwtSecret",{
                        expiresIn:"1 day",
                    });
                    res.send({
                        status:200,
                        resultado: { matricula, nombre, aPaterno, aMaterno,foto,permisos, token, auth:result1, mensaje:'datos correctos' },
                        // result,
                    });

                }else {
                    res.send({
                        status:102,
                        resultado: { token:'', auth:result1, mensaje: 'Password incorrecto', },
                    });

                }
            });
        }else {
            res.send({
                status:101,
                resultado:{token:'', auth:false, mensaje: 'usuario incorrecto',}
            })
        }
    });
  });

  // Acceso a un alumno
  app.get('/alumno/calificaciones', verificarToken, (req, res)=>{
    const { matricula, auth } = req;
    console.log('aqui');
    console.log(matricula);
    const sql = 'SELECT * FROM calificaciones WHERE matricula =?';
    db.query(sql, [matricula], (err,result)=>{
        // console.log(result.length);
        if(err) {
            return (
                res.send({
                    status:403,
                    err,
                    mensaje:'Problemas de red, contacte al administrador',
                })
            );
        }
        if(result.length>0) {
            return (
                res.send({
                    status:200,
                    result,
                    mensaje:'Calificaciones encontradas'                
                })
            );
           
        }else {
            res.send({
                status:101,
                result,
                mensaje: 'No se encontraron calificaciones',
            })
        }
    });
  });

  app.post('/alumno/photos/upload', verificarToken, (req, res)=>{
    const { auth, matricula } = req;

    if(auth) {
        const file = req.files;
        if(!file || Object.keys(req.files).length===0) {
            return res.send({
                status:403,
                resultado:{
                    mensaje:'No su subieron archivos',
                }
            })
        }
        const archivo = req.files.imagen;
        const uploadPath = __dirname+'/imagenes/'+matricula+path.extname(archivo.name);
        archivo.mv(uploadPath, (err) => {
            if(err) {
                return res.send({
                    status:403,
                    err,
                    resultado:{
                        mensaje:'No fue posible subir el archivo',
                    }
                })
            }
            return res.send({
                status:200,
                resultado:{
                    mensaje:'se subio el archivo',
                    archivo:matricula+path.extname(archivo.name),
                }
            })

        })


    }
  });

 
// ruta que no exista
app.all("*", (req, res)=> {
    res.send("that route dosn't exists");
});
app.listen(port, () => {
  console.log(`escuchando en el puerto ${port}`)
});