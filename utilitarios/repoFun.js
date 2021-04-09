function getAutorizacion(dato){
    return dato.replace(/\r?\n|\r/g,' ').replace(/[^0-9\s]/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(n => n.length > 7)[0]
}

module.exports = { getAutorizacion }