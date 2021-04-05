/**
 * Autor: Fernando Mendoza Escobar
 */

const express = require('express')
const config = require('../utilitarios/configData');
const app = express() //obtiene el objeto express
const router = require('./router')

app.use('/api', router)

app.listen(config.port, () => {
  console.log(`Serve on port ${config.port}`)
})
