const config = require('../utilitarios/configData')

module.exports = {
  '@tags': ['cic-historico'],
  abortOnElementLocateError: false,
  asyncHookTimeout: 10000,

  demoTestAsync: async function (browser) {
    const { npm_config_varUser, npm_config_varPassword, npm_config_varclienteCI, npm_config_varInicioMes, npm_config_varFinMes, npm_config_varInicioAnio, npm_config_varFinAnio } = process.env

    const mainUser = 'psanchez@idepro.org'
    const mainPassword = 'Brian*240811'
    const mainQueryInputUser = `input[name="ctl00$IFMainContent$txtLogin"]`
    const mainQueryInputPassword = `input[name="ctl00$IFMainContent$txtPasswd"]`
    const submitButtonLogin = `.btnAceptar[type="submit"]`
    const submitButtonConsultaHistorica = `a[href="ConsultasDefault.aspx?opPag=3"]`
    const mainQueryInputCodIdentidad = `input[name="ctl00$ctl00$IFMainContent$DefaultContent$txtIdentificacionHistorico"]`
    const mainCodIdentidad = '3455687LP'
    const submitButtonConsultar = `input[name="ctl00$ctl00$IFMainContent$DefaultContent$btnConsultaHistorico"]`

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

    const submitButtonConsultarReport = `input[name="ctl00$ctl00$IFMainContent$DefaultContent$btnExportar"]`

    browser.url('http://apps.supernet.bo/IC/Autentication.aspx')

    browser.pause(2000)
    browser.setValue(mainQueryInputUser, mainUser)
    browser.setValue(mainQueryInputPassword, mainPassword)
    browser.click(submitButtonLogin) // onClick Login

    browser.click(submitButtonConsultaHistorica) // onClick ConsultaHistorica

    browser.pause(2000)
    browser.click(selectInicioMes)
    browser.click(`${selectInicioMes} ${mainQueryInicioMes}`)
    browser.click(selectFinMes)
    browser.click(`${selectFinMes} ${mainQueryFinMes}`)

    browser.click(selectInicioAnio)
    browser.click(`${selectInicioAnio} ${mainQueryInicioAnio}`)
    browser.click(selectFinAnio)
    browser.click(`${selectFinAnio} ${mainQueryFinAnio}`)

    console.log('1111111111111111111111111111111111111111111111111111')
    browser.setValue(mainQueryInputCodIdentidad, mainCodIdentidad)
    browser.click(submitButtonConsultar) // onClick consulta documento
    console.log('222222222222222222222222222222222222222222222222222222222')

    browser.pause(10000)

    // * Validación
    const resultAlert = await browser.getAlertText()
    console.log('resultAlert ===================================>', resultAlert)
    if (resultAlert.status !== -1) {
      browser.acceptAlert()
      
    } 
    browser.pause(2000)
    browser.click(submitButtonConsultarReport) // onClick consulta report
    browser.pause(`${config.time}`)
  },
  after: function (browser) {
    browser.end()
  }
}
