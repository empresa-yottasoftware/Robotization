// Controller para consultas cic-historica
const fs = require('fs')
const pdf2base64 = require('pdf-to-base64')

const cicHistorica = (pData = {}) => {
  return new Promise((resolve, reject) => {
    const { ciCliente } = pData
    // Fecha
    var f = new Date()
    let fecha = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()}`
    const nameArchivoReport = `${ciCliente}-asfi-historica-${fecha}`
    fs.rename('./test_image/pdf/rptDeudaHistorico.pdf', `./test_image/pdf/${nameArchivoReport}.pdf`, err => {
      if (err) {
        reject({
          Correcto: false,
          Mensaje: `Error al renombrar archivo: ${nameArchivoReport}`,
          err
        })
      } else {
        console.log('Nombre Editado Satisfactoriamente (CIC-Historica)')
        pdf2base64(`./test_image/pdf/${nameArchivoReport}.pdf`)
          .then(response => {
            console.log(response)
            resolve({
              Correcto: true,
              imageNameCicHirotica: nameArchivoReport,
              base64CicHistorica: response,
              fecha,
              tipoRobotizacion: 'Servicio ASFI-CIC-HISTORICA',
              Resultado: 'Consulta CIC-historica finalizada correctamente.',
              Tipo: 'cic-historica'
            })
          })
          .catch(error => {
            console.log(error)
            reject({
              Correcto: false,
              Mensaje: 'Error al convertir archivo a base64',
              error
            })
          })
      }
    })
  })
}

module.exports = { cicHistorica }
