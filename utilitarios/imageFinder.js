const repoFun = require('./repoFun')

function finderCIC(dato = '') {
  console.log('dato', dato)
  let data = {}
  let separador = '\n' // un espacio en blanco
  let arregloDeSubCadenas = dato.split(separador)
  let arrayAutorizacion = arregloDeSubCadenas[0].split(' ')
  let autorizacion = repoFun.getAutorizacion(dato)

  data['autorizacion'] = (autorizacion) ? autorizacion : ''


  let arrayDeuda = arregloDeSubCadenas[4].split(' ')
  let deuda = arrayDeuda[2]
  data['deuda'] = deuda

  let sw
  let arrayCarteraDirecta = []
  for (const i in arregloDeSubCadenas) {
    if (arregloDeSubCadenas[i] === 'Cartera Directa:') {
      sw = true
    }
    if (sw && arregloDeSubCadenas[i] !== ' ') {
      arrayCarteraDirecta.push(arregloDeSubCadenas[i])
    }
  }

  let obj = {}
  for (const i in arrayCarteraDirecta) {
    let arregloFila = arrayCarteraDirecta[i].split(' ')
    obj[`${i}`] = arregloFila
  }

  let arrayAlfabeto = []
  for (const key in obj) {
    const element = obj[key]
    let tipoCartera = element[2]
    switch (tipoCartera) {
      case 'A':
        arrayAlfabeto.push(1)
        break
      case 'B':
        arrayAlfabeto.push(2)
        break
      case 'C':
        arrayAlfabeto.push(3)
        break
      case 'D':
        arrayAlfabeto.push(4)
        break
      case 'E':
        arrayAlfabeto.push(5)
        break
      case 'F':
        arrayAlfabeto.push(6)
        break

      default:
        break
    }
  }

  let may = 0
  for (const i in arrayAlfabeto) {
    if (arrayAlfabeto[i] > may) {
      may = arrayAlfabeto[i]
    }
  }

  let CarteraDIR = ''
  switch (may) {
    case 1:
      CarteraDIR = 'A'
      break
    case 2:
      CarteraDIR = 'B'
      break
    case 3:
      CarteraDIR = 'C'
      break
    case 4:
      CarteraDIR = 'D'
      break
    case 5:
      CarteraDIR = 'E'
      break
    case 6:
      CarteraDIR = 'F'
      break

    default:
      break
  }

  data['carteraDIR'] = CarteraDIR
  console.log('carteraDIR: ', data)

  return data
}

function finderCPOP(dato = '') {
  // dato = dato.replace(/\n/g, ' ')
  // let array = dato.split(/ NO /)
  // console.log('array :', array)
  // let cumple
  // if (array.length === 1 ) {
  //   cumple = 'SI'
  // } else {
  //   cumple = 'NO'
  // }
  // return cumple
  console.log(dato)
  dato = dato.replace(/\n/g, ' ')
  let array = dato.split(/ NO /)
  let cumple = ''
  if (array.length === 1) {
    cumple = 'SI'
  } else {
   cumple = 'NO'
  }
  console.log('cumple :', cumple)
  return cumple
}

module.exports = { finderCIC, finderCPOP }
