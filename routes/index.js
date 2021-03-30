/**
 * Autor: Fernando Mendoza Escobar
 */

const express = require('express')
const app = express() //obtiene el objeto express
const { exec } = require('child_process')
const fs = require('fs')
var cors = require('cors')
let CryptoJS = require('crypto-js')
const axios = require('axios')
const qs = require('qs')
const config = require('../utilitarios/configData')
const image2base64 = require('image-to-base64')
const { finderCIC, finderCPOP } = require('../utilitarios/imageFinder')
const { cicHistorica } = require('../controllers/asfi.controller')
const { cic, cpop, cicNit } = require('../utilitarios/dataServidor.json')
let bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '100MB' }))
app.use(bodyParser.urlencoded({ limit: '100MB', extended: true }))

app.get('/user', (req, res) => {
  res.json({
    username: 'Cameron',
    lastname: 'Howe'
  })
})

// Creación de Router CIC
app.post('/cic', cors(), (req, res) => {
  console.log(req.body)
  let user = req.body.user.toLowerCase()
  let password = req.body.password
  let _ciCliente = req.body.ciCliente.trim()
  let ciCliente = _ciCliente.split(' ').join('')
  let codigoUsuario = req.body.codigoUsuario
  let ruta = req.body.ruta
  let bytes = CryptoJS.AES.decrypt(password, 'PASSWORD')
  // password = bytes.toString(CryptoJS.enc.Utf8)
  console.log('Datos:', user, ciCliente, password)

  // Fecha
  var f = new Date()
  let fecha = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()}`

  exec(`npm --varUser=${user} --varPassword=${password} --varclienteCI=${ciCliente} test -- --tag cic`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      res.send('Error al consultar CIC')
      return
    }
    fs.rename('./test_image/pdf/rptDeudaEntidad.pdf', `./test_image/pdf/${ciCliente}-${codigoUsuario}-CIC-${fecha}.pdf`, err => {
      if (err) throw err
      console.log('Nombre Editado Satisfactoriamente')
      let obj = {
        ciCliente: ciCliente,
        user: codigoUsuario,
        autorizacion: null
      }
      let listadoPorHacer = []
      listadoPorHacer.push(obj)
      let data = JSON.stringify(listadoPorHacer)
      fs.writeFile('file/data.json', data, err => {
        if (err) throw new Error('No se puedo grabar', err)
      })
      console.log('MODIFICACION CARPETA')
      exec('node test_image/quicktest.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          res.send('Error al cambiar formato pdf a png CIC')
          return
        }
        image2base64(`${config.url}/test_image/image/${ciCliente}-${codigoUsuario}-CIC-${fecha}.png`)
          .then(responseBase64 => {
            axios
              .post(
                config.urlImage,
                qs.stringify({
                  img: responseBase64
                })
              )
              .then(function (response) {
                let dato = response.data.data.prediction
                let autorizacion = finderCIC(dato).autorizacion
                let obj = finderCIC(dato)
                console.log('Autorización:', autorizacion, obj)
                let imageNames = `${ciCliente}-${codigoUsuario}`
                let imageNameCIC = `${imageNames}-CIC-${fecha}`
                let dirCIC = finderCIC(dato).carteraDIR !== '' ? finderCIC(dato).carteraDIR : 'Sin deudas'
                let base64CIC = responseBase64

                res.send({
                  imageNameCIC,
                  base64CIC,
                  dirCIC,
                  autorizacion,
                  fecha,
                  tipoRobotizacion: 'Servicio ASFI-CIC',
                  Resultado: 'Consulta CIC finalizada correctamente.',
                  Correcto: true,
                  Tipo: 'cic'
                })
                return
              })
              .catch(function (error) {
                console.log(error)
                res.send('Error al servivio reconociemnto de imagenes')
              })
          })
          .catch(error => {
            console.log(error)
            res.send('Error al convertir png a base64')
          })
      })
    })
  })
})

// Creación de Router CIC-NIT
app.post('/cic-nit', cors(), (req, res) => {
  console.log(req.body)
  let user = req.body.user.toLowerCase()
  let password = req.body.password
  let ciCliente = req.body.ciCliente
  let codigoUsuario = req.body.codigoUsuario
  let ruta = req.body.ruta
  let bytes = CryptoJS.AES.decrypt(password, 'PASSWORD')
  // password = bytes.toString(CryptoJS.enc.Utf8)
  console.log('Datos:', user, ciCliente, password)

  // Fecha
  var f = new Date()
  let fecha = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()}`

  exec(`npm --varUser=${user} --varPassword=${password} --varclienteCI=${ciCliente} test -- --tag cic`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      res.send('Error al consultar CIC')
      return
    }
    fs.rename('./test_image/pdf/rptDeudaEntidad.pdf', `./test_image/pdf/${ciCliente}-${codigoUsuario}-CIC-${fecha}.pdf`, err => {
      if (err) throw err
      console.log('Nombre Editado Satisfactoriamente')
      let obj = {
        ciCliente: ciCliente,
        user: codigoUsuario,
        autorizacion: null
      }
      let listadoPorHacer = []
      listadoPorHacer.push(obj)
      let data = JSON.stringify(listadoPorHacer)
      fs.writeFile('file/data.json', data, err => {
        if (err) throw new Error('No se puedo grabar', err)
      })

      exec('node test_image/quicktest.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          res.send('Error al cambiar formato pdf a png CIC')
          return
        }
        image2base64(`${config.url}/test_image/image/${ciCliente}-${codigoUsuario}-CIC-${fecha}.png`)
          .then(responseBase64 => {
            axios
              .post(
                config.urlImage,
                qs.stringify({
                  img: responseBase64
                })
              )
              .then(function (response) {
                let dato = response.data.data.prediction
                let autorizacion = finderCIC(dato).autorizacion
                let obj = finderCIC(dato)
                console.log('Autorización:', autorizacion, obj)
                let imageNames = `${ciCliente}-${codigoUsuario}`
                let imageNameCICNIT = `${imageNames}-CIC-NIT-${fecha}`
                let dirCIC = finderCIC(dato).carteraDIR !== '' ? finderCIC(dato).carteraDIR : 'Sin deudas'
                let base64CICNIT = responseBase64

                res.send({
                  imageNameCICNIT,
                  base64CICNIT,
                  dirCIC,
                  autorizacion,
                  fecha,
                  tipoRobotizacion: 'Servicio ASFI-CIC-NIT',
                  Resultado: 'Consulta CIC-NIT finalizada correctamente.',
                  Correcto: true,
                  Tipo: 'cic-nit'
                })
                return
              })
              .catch(function (error) {
                console.log(error)
                res.send('Error al servivio reconociemnto de imagenes') //request post
              })
          })
          .catch(error => {
            console.log(error) //Exepection error....
            res.send('Error al convertir png a base64')
          })
      })
    })
  })
})

// Creación de Router CPOP
app.post('/cpop/', cors(), (req, res) => {
  console.log(req.body)
  let user = req.body.user.toLowerCase()
  let password = req.body.password
  let _ciCliente = req.body.ciCliente.trim()
  let ciCliente = _ciCliente.split(' ').join('')
  let codigoUsuario = req.body.codigoUsuario
  let ruta = req.body.ruta
  // let bytes = CryptoJS.AES.decrypt(password, 'PASSWORD')
  let autorizacion = req.body.autorizacion
  // password = bytes.toString(CryptoJS.enc.Utf8)

  // Fecha
  var f = new Date()
  let fecha = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()}`

  console.log('Datos:', user, ciCliente, password)
  exec(`npm --varUser=${user} --varPassword=${password} --varClienteCI=${ciCliente} --varAutorizacion=${autorizacion} test -- --tag cpop`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      res.send('Error al consultar CPOP')
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
    fs.rename('./test_image/pdf/rptCertificadoCPOP.pdf', `./test_image/pdf/${ciCliente}-${codigoUsuario}-CPOP-${fecha}.pdf`, err => {
      if (err) throw err
      console.log('Nombre Editado Satisfactoriamente')

      let obj = {
        ciCliente: ciCliente,
        user: codigoUsuario,
        autorizacion: autorizacion
      }
      let listadoPorHacer = []
      listadoPorHacer.push(obj)
      let data = JSON.stringify(listadoPorHacer)
      fs.writeFile('file/data.json', data, err => {
        if (err) throw new Error('No se puedo grabar', err)
      })

      exec('node test_image/quicktest.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          res.send('Error al cambiar formato pdf a png CPOP')
          return
        }

        image2base64(`${config.url}/test_image/image/${ciCliente}-${codigoUsuario}-CPOP-${fecha}.png`).then(responseBase64 => {
          axios
            .post(
              config.urlImage,
              qs.stringify({
                img: responseBase64
              })
            )
            .then(function (response) {
              let dato = response.data.data.prediction
              let cumplimientoCPOP = finderCPOP(dato)
              console.log('Autorización:', cumplimientoCPOP, obj)
              let imageNames = `${ciCliente}-${codigoUsuario}`
              let imageNameCPOP = `${imageNames}-CPOP-${fecha}`
              let base64CPOP = responseBase64

              res.send({
                fecha,
                imageNameCPOP,
                base64CPOP,
                cumplimientoCPOP,
                tipoRobotizacion: 'Servicio ASFI-CPOP',
                Resultado: 'Consulta CIC finalizada correctamente.',
                Correcto: true,
                Tipo: 'cpop'
              })
              return
            })
        })
      })
    })
  })
})

// Creación de Router Servidor
app.post('/servidor/:tipo', cors(), (req, res) => {
  setTimeout(() => {
    console.log(req.body)
    let user = req.body.user.toLowerCase()
    let password = req.body.password
    let _ciCliente = req.body.ciCliente.trim()
    let ciCliente = _ciCliente.split(' ').join('')
    let codigoUsuario = req.body.codigoUsuario
    // password = bytes.toString(CryptoJS.enc.Utf8)
    console.log('Datos:', user, ciCliente, password)
    console.log('tipo', req.params.tipo)
    // Fecha
    var f = new Date()
    let fecha = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()}`
    let imageNames
    switch (req.params.tipo) {
      case 'cic':
        imageNames = `${ciCliente}-${codigoUsuario}`
        let imageNameCIC = `${imageNames}-CIC-${fecha}`
        res.send({
          imageNameCIC,
          fecha,
          base64CIC: cic[0].base64CIC,
          dirCIC: cic[0].dirCIC,
          autorizacion: cic[0].autorizacion,
          tipoRobotizacion: cic[0].tipoRobotizacion,
          Tipo: cic[0].NombreRobotizacion,
          Resultado: cic[0].Resultado,
          Correcto: true
        })
        break
      case 'cpop':
        imageNames = `${ciCliente}-${codigoUsuario}`
        let imageNameCPOP = `${imageNames}-CPOP-${fecha}`

        res.send({
          imageNameCPOP,
          fecha,
          base64CPOP: cpop[0].base64CPOP,
          cumplimientoCPOP: cpop[0].cumplimientoCPOP,
          tipoRobotizacion: cpop[0].tipoRobotizacion,
          Tipo: cpop[0].NombreRobotizacion,
          Resultado: cpop[0].Resultado,
          Correcto: cpop
        })
        break

      case 'cic-nit':
        imageNames = `${ciCliente}-${codigoUsuario}`
        let imageNameCICNIT = `${imageNames}-CIC-NIT-${fecha}`

        res.send({
          imageNameCICNIT,
          fecha,
          base64CICNIT: cicNit[0].base64CICNIT,
          dirCIC: cicNit[0].dirCIC,
          autorizacion: cicNit[0].autorizacion,
          tipoRobotizacion: cicNit[0].tipoRobotizacion,
          Tipo: cicNit[0].NombreRobotizacion,
          Resultado: cicNit[0].Resultado,
          Correcto: true
        })
        break

      default:
        break
    }
  }, 100)
})

// Creación de Router CIC-HISTORICA
app.post('/cic-historica', cors(), (req, res) => {
  console.log(req.body)
  let user = req.body.user.toLowerCase()
  let password = req.body.password
  let _ciCliente = req.body.ciCliente.trim()
  let ciCliente = _ciCliente.split(' ').join('')
  let codigoUsuario = req.body.codigoUsuario
  let ruta = req.body.ruta
  let bytes = CryptoJS.AES.decrypt(password, 'PASSWORD')
  password = bytes.toString(CryptoJS.enc.Utf8)
  console.log('Datos:', user, ciCliente, password)
  const { inicioMes, finMes, inicioAnio, finAnio } = req.body

  exec(`npm --varUser=${user} --varPassword=${password} --varclienteCI=${ciCliente} --varInicioMes=${inicioMes} --varFinMes=${finMes} --varInicioAnio=${inicioAnio} --varFinAnio=${finAnio} test -- --tag cic-historica`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return res.status(404).json({
        Correcto: false,
        Mensaje: 'Error al robotizar',
        err: stderr
      })
    }
    cicHistorica({ ciCliente })
      .then(result => {
        console.log(`result`, result)
        res.status(200).json(result)
      })
      .catch(err => {
        console.log(`err`, err)
        return res.status(404).json(err)
      })
  })
})

app.listen(config.port, () => {
  console.log(`Serve on port ${config.port}`)
})
