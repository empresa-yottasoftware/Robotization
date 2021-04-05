const fs = require('fs') // Escribir un archivo
const config = require('../utilitarios/configData')

module.exports = {
  '@tags': ['cic-historica'],

  demoTestAsync: async function (browser) {
    const { npm_config_varUser, npm_config_varPassword, npm_config_varclienteCI, npm_config_varInicioMes, npm_config_varFinMes, npm_config_varInicioAnio, npm_config_varFinAnio } = process.env
    // ? Variables de entrada
    const mainUser = process.env.npm_config_varUser
    const mainPassword = process.env.npm_config_varPassword
    const mainQueryInputUser = `input[name="ctl00$IFMainContent$txtLogin"]`
    const mainQueryInputPassword = `input[name="ctl00$IFMainContent$txtPasswd"]`
    const submitButtonLogin = `.btnAceptar[type="submit"]`
    const submitButtonConsultaHistorica = `a[href="ConsultasDefault.aspx?opPag=3"]`
    const mainQueryInputCodIdentidad = `input[name="ctl00$ctl00$IFMainContent$DefaultContent$txtIdentificacionHistorico"]`
    const mainCodIdentidad = process.env.npm_config_varclienteCI
    const submitButtonConsultar = `input[name="ctl00$ctl00$IFMainContent$DefaultContent$btnConsultaHistorico"]`

    // ? Variables Fechas historicas
    // Mes
    const selectInicioMes = `#IFMainContent_DefaultContent_cmbInicioHistorico_ddlMes`
    const mainQueryInicioMes = `option[value="${npm_config_varInicioMes}"]`
    const selectFinMes = `#IFMainContent_DefaultContent_cmbFinHistorico_ddlMes`
    const mainQueryFinMes = `option[value="${npm_config_varFinMes}"]`
    // Año
    const selectInicioAnio = `#IFMainContent_DefaultContent_cmbInicioHistorico_ddlAnio`
    const mainQueryInicioAnio = `option[value="${npm_config_varInicioAnio}"]`
    const selectFinAnio = `#IFMainContent_DefaultContent_cmbFinHistorico_ddlAnio`
    const mainQueryFinAnio = `option[value="${npm_config_varFinAnio}"]`

    // ? Generar reporte
    const submitButtonConsultarReport = `input[name="ctl00$ctl00$IFMainContent$DefaultContent$btnExportar"]`

    // ! URL
    browser.url('http://apps.supernet.bo/IC/Autentication.aspx')

    //* Body login
    browser.pause(`${config.time}`)
    browser.setValue(mainQueryInputUser, mainUser)
    browser.setValue(mainQueryInputPassword, mainPassword)
    const resultClickLogin = await browser.click(submitButtonLogin) // onClick Login
    console.log('resultClickLogin', resultClickLogin)

    browser.pause(`${config.time}`)
    browser.click(submitButtonConsultaHistorica) // onClick ConsultaHistorica

    // * Body consulta de endeudamiento histórico
    browser.pause(`${config.time}`)
    browser.click(selectInicioMes)
    browser.click(`${selectInicioMes} ${mainQueryInicioMes}`)
    browser.click(selectFinMes)
    browser.click(`${selectFinMes} ${mainQueryFinMes}`)

    browser.click(selectInicioAnio)
    browser.click(`${selectInicioAnio} ${mainQueryInicioAnio}`)
    browser.click(selectFinAnio)
    browser.click(`${selectFinAnio} ${mainQueryFinAnio}`)

    // * Body consulta documento identidad
    browser.pause(`${config.time}`)
    browser.setValue(mainQueryInputCodIdentidad, mainCodIdentidad)
    browser.click(submitButtonConsultar) // onClick consulta documento
    browser.pause(5000)

    // * Body generar reporte
    browser.pause(`${config.time}`)
    browser.click(submitButtonConsultarReport) // onClick consulta report
    browser.pause(`${config.time}`)
  },
  after: function (browser) {
    browser.end()
  }
}
