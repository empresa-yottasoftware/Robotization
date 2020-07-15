var pdf2png = require('../lib/pdf2png.js')
var fs = require('fs')
var listadoPorHacer = require('../file/data.json')
let ciCliente = listadoPorHacer[0]['ciCliente']
let user = listadoPorHacer[0]['user']
let autorizacion = listadoPorHacer[0]['autorizacion']

console.log('listadoPorHacer!!!!!!!!!!!!', ciCliente, ciCliente)

var projectPath = __dirname.split('\\')
projectPath.pop()
projectPath = projectPath.join('\\')

var gsPath = projectPath + '\\executables\\ghostScript'

// Rewrite the ghostscript path
pdf2png.ghostscriptPath = gsPath

// Fecha
var f = new Date()
let fecha = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()}`


// Example with higher quality
if (!autorizacion) {
  pdf2png.convert(__dirname + `/pdf/${ciCliente}-${user}-CIC-${fecha}.pdf`, { quality: 200 }, function(resp) {
    if (!resp.success) {
      console.log('Something went wrong: ' + resp.error)
  
      return
    }
  
    console.log("Yayy the pdf got converted, now I'm gonna save it!")
  
    fs.writeFile(`test_image/image/${ciCliente}-${user}-CIC-${fecha}.png`, resp.data, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('The file was saved!')
      }
    })
  })
} else {
  pdf2png.convert(__dirname + `/pdf/${ciCliente}-${user}-CPOP-${fecha}.pdf`, { quality: 200 }, function(resp) {
    if (!resp.success) {
      console.log('Something went wrong: ' + resp.error)
  
      return
    }
  
    console.log("Yayy the pdf got converted, now I'm gonna save it!")
  
    fs.writeFile(`test_image/image/${ciCliente}-${user}-CPOP-${fecha}.png`, resp.data, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('The file was saved!')
      }
    })
  })
}
