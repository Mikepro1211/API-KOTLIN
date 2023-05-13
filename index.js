//instancias de Express, MySQL, bodyparser
const express = require('express')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const { restart } = require('nodemon')

const app = express()
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-with, Content-Type, Accept");
    next()
})
app.use(bodyparser.json())
//definir puerto  para el servidor
const Puerto = 3000
//datos de coneccion a la base de datos  
const conexion = mysql.createConnection(
    {
        host:'localhost',
        database:'profesores',
        user:'root',
        password: ''
    }
)
//mensaje para poder definir si se tiene una coneccion exitosa
//?npm run dev para levantar servidor?/

app.listen(Puerto,()=>{
    console.log(`Servidor Corriendo en puerto ${Puerto}`);
})
//coneccion con base de dato
conexion.connect(error=>{
    if(error) throw error
    console.log('Conexion exitosa a la base de dato mysql')
})
app.get('/',(req, res)=>{
    res.send('API')
})
//ruta para api de /usuarios
//comandos sql
app.get('/usuarios',(req, res)=>{
    const query = `SELECT * FROM  usuarios`;
    conexion.query(query,(error,resultado)=>{
        if(error) return console.error(error.message)
        const obj ={}
        if(resultado.length > 0){
            obj.listaUsuarios = resultado
            res.json(obj)
        }else {
            res.json('No hay registro')
        }
    })
})
//
app.get('/usuario/:id',(req, res)=>{
    const {id}= req.params
    const query = `SELECT * FROM  usuarios WHERE idUsuario= ${id} `;
    conexion.query(query,(error,resultado)=>{
        if(error) return console.error(error.message)    
        if(resultado.length > 0){
            res.json(obj)
        }else {
            res.json('No hay registro')
        }
    })
})
app.post('/usuario/add',(req, res)=>{
    const usuario ={
        nombre: req.body.nombre,
        email: req.body.email
    }
    const query =`INSERT INTO usuarios SET ?`
    conexion.query(query,usuario ,(error)=>{
        if(error) return console.error(error.message)    
        res.json('Se inserto correctamente el usuario')
    })
})
app.put('/usuario/update/:id',(req, res)=>{
    const {id} = req.params
    const {nombre,email} = req.body

    const query =`UPDATE usuarios SET nombre='${nombre}', email='${email}' WHERE idUsuario='${id}'`;
    conexion.query(query ,(error)=>{
        if(error) return console.error(error.message)    
        res.json('Se Actualizo correctamente el usuario')
    })
})

app.delete('/usuario/delete/:id' , (req, res)=>{
    const {id} = req.params
    const query = `DELETE FROM usuarios WHERE idUsuario=${id}`;
    conexion.query(query,(error)=>{
        if(error) console.error(error.message)
        res.json('Se elimino correctamente')
    })
})
