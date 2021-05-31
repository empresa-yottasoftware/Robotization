/**
 * Autor: Fernando Mendoza Escobar
 */

 // npm install cors
 const express = require('express')
 const cors = require('cors')
 
 const config = require('../utilitarios/configData');
 const app = express() //obtiene el objeto express
 
 app.use(cors())
 
 
 const router = require('./router')
 
 app.use((req,res,next)=> {
   console.log('PETICION:',req)
   next()
 })
 
 app.use(router)
 
 app.listen(config.port, () => {
   console.log(`Serve on port ${config.port}`)
 })
 