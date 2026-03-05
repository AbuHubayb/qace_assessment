Cypress.Commands.add('login', (username, password) => {
  cy.visit('https://www.saucedemo.com/')
  cy.get('#user-name').type(username)
  cy.get('#password').type(password)
  cy.get('#login-button').click()
})

Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/users/login',
    body: { email, password }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('access_token')
    return response.body.access_token
  })
})