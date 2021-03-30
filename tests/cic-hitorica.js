const fs = require('fs') // Escribir un archivo

module.exports = {
  '@tags': ['cic-historica'],
  abortOnElementLocateError: true,
  asyncHookTimeout: 10000,

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
    // browser.pause(200000);

    //* Body login
    browser.waitForElementVisible(mainQueryInputUser)
    browser.setValue(mainQueryInputUser, mainUser)
    browser.waitForElementVisible(mainQueryInputPassword)
    browser.setValue(mainQueryInputPassword, mainPassword)
    browser.waitForElementVisible(submitButtonLogin)
    const resultClickLogin = await browser.click(submitButtonLogin) // onClick Login
    console.log('resultClickLogin', resultClickLogin)

    // * Validación credenciales incorrectas
    const resultAlertCredenciales = await browser.getAlertText()
    console.log('resultAlertCredenciales', resultAlertCredenciales)

    if (resultAlertCredenciales.status == -1) {
      browser.waitForElementVisible(submitButtonConsultaHistorica)
      browser.click(submitButtonConsultaHistorica) // onClick ConsultaHistorica

      // * Body consulta de endeudamiento histórico
      browser.waitForElementVisible(selectInicioMes)
      browser.click(selectInicioMes)
      browser.click(`${selectInicioMes} ${mainQueryInicioMes}`)
      browser.waitForElementVisible(selectFinMes)
      browser.click(selectFinMes)
      browser.click(`${selectFinMes} ${mainQueryFinMes}`)

      browser.waitForElementVisible(selectInicioAnio)
      browser.click(selectInicioAnio)
      browser.click(`${selectInicioAnio} ${mainQueryInicioAnio}`)
      browser.waitForElementVisible(selectFinAnio)
      browser.click(selectFinAnio)
      browser.click(`${selectFinAnio} ${mainQueryFinAnio}`)

      // * Body consulta documento identidad
      browser.waitForElementVisible(mainQueryInputCodIdentidad)
      browser.setValue(mainQueryInputCodIdentidad, mainCodIdentidad)
      browser.click(submitButtonConsultar) // onClick consulta documento
      browser.pause(5000)

      // * Body screenshots reporte
      browser.resizeWindow(1924, 8024)
      browser.saveScreenshot('./screenshots/report-asfi.png')

      // *Body generar reporte
      browser.waitForElementVisible(submitButtonConsultarReport)
      browser.click(submitButtonConsultarReport) // onClick consulta report

      browser.pause(6000)
    } else {
      // * True error credenciales, guarda respuesta.
      browser.acceptAlert()
      let dataErrorCredenciales = {
        Correcto: true,
        Estado: 2,
        Mensaje: resultAlertCredenciales.value
      }
      dataErrorCredenciales = JSON.stringify(dataErrorCredenciales, null, 2)
      fs.writeFile('db/dataErrorCredenciales.json', dataErrorCredenciales, err => {
        if (err) throw new Error('No se puedo grabar', err)
      })
    }
  },
  after: function (browser) {
    browser.end()
  }
}
