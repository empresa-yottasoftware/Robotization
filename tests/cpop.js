module.exports = {
  '@tags': ['cpop'],
  'CIC advanced search: Reporte'(browser) {
    const mainUser = process.env.npm_config_varUser
    const mainPassword = process.env.npm_config_varPassword

    const mainQueryInputUser = 'input[name="ctl00$IFMainContent$txtLogin"]'
    const mainQueryInputPassword = 'input[name="ctl00$IFMainContent$txtPasswd"]'
    const submitButtonSelector = '.btnAceptar[type="submit"]'

    const submitButtonConsultaCPOP =
      'a[href="ConsultasCPOPDefault.aspx?opPag=14"]'
    const mainQueryInputIdent =
      'input[name="ctl00$ctl00$IFMainContent$DefaultContent$txtIdentificacion"]'
    const mainQueryInputAutori =
      'input[name="ctl00$ctl00$IFMainContent$DefaultContent$txtNumeroAutorizacion"]'
    const mainIdentidad = process.env.npm_config_varClienteCI
    const mainAutorizacion = process.env.npm_config_varAutorizacion
    const submitButtonConsultar =
      '#IFMainContent_DefaultContent_pnlConsultaIndividual input[type="submit"]'

    browser
      .url('http://apps.supernet.bo/IC/Autentication.aspx')
      .setValue(mainQueryInputUser, mainUser)
      .setValue(mainQueryInputPassword, mainPassword)
      .click(submitButtonSelector)
      .click(submitButtonConsultaCPOP)
      .setValue(mainQueryInputIdent, mainIdentidad)
      .setValue(mainQueryInputAutori, mainAutorizacion)
    browser.click({
      selector: submitButtonConsultar,
      timeout: 8000
    })
    browser.pause(8000)
  }
}
