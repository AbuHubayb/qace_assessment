describe('SauceDemo Test Suite', () => {

  const validUser = 'standard_user'
  const lockedUser = 'locked_out_user'
  const validPassword = 'secret_sauce'
  const invalidPassword = 'wrong_pass'

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  //  LOGIN TESTS

  describe('Login Tests', () => {

    it('Valid Login - standard_user', () => {
      cy.get('#user-name').type(validUser)
      cy.get('#password').type(validPassword)
      cy.get('#login-button').click()

      cy.url().should('include', 'inventory')
      cy.get('.title').should('contain', 'Products')
    })

    it('Invalid Login - Wrong Password', () => {
      cy.get('#user-name').type(validUser)
      cy.get('#password').type(invalidPassword)
      cy.get('#login-button').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Invalid Login - Locked Out User', () => {
      cy.get('#user-name').type(lockedUser)
      cy.get('#password').type(validPassword)
      cy.get('#login-button').click()

      cy.get('[data-test="error"]').should('contain', 'locked out')
    })

    it('Invalid Login - Empty Username', () => {
      cy.get('#password').type(validPassword)
      cy.get('#login-button').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Invalid Login - Empty Password', () => {
      cy.get('#user-name').type(validUser)
      cy.get('#login-button').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Invalid Login - Both Fields Empty', () => {
      cy.get('#login-button').click()
      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Invalid Login - SQL Injection Attempt', () => {
      cy.get('#user-name').type("' OR 1=1 --")
      cy.get('#password').type("anything")
      cy.get('#login-button').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

  })

  // ADD TO CART TESTS

  describe('Add To Cart Tests', () => {

    beforeEach(() => {
      cy.login(validUser, validPassword)
    })

    it('Valid - Add Single Product', () => {
      cy.get('.inventory_item').first().contains('Add to cart').click()
      cy.get('.shopping_cart_badge').should('contain', '1')
    })

    it('Valid - Add Multiple Products', () => {
      cy.get('.inventory_item').eq(0).contains('Add to cart').click()
      cy.get('.inventory_item').eq(1).contains('Add to cart').click()
      cy.get('.shopping_cart_badge').should('contain', '2')
    })

    it('Negative - Rapid Click Add Button', () => {
      cy.get('.inventory_item').first().contains('Add to cart')
        .click()
        .click()
        .click()

      cy.get('.shopping_cart_badge').should('contain', '1')
    })

    it('Negative - Add Without Login', () => {
      cy.clearCookies()
      cy.visit('https://www.saucedemo.com/inventory.html')
      cy.url().should('include', '/')
    })

  })

  // CHECKOUT TESTS

  describe('Checkout Tests', () => {

    beforeEach(() => {
      cy.login(validUser, validPassword)
      cy.get('.inventory_item').first().contains('Add to cart').click()
      cy.get('.shopping_cart_link').click()
      cy.contains('Checkout').click()
    })

    it('Valid - Complete Checkout', () => {
      cy.get('#first-name').type('John')
      cy.get('#last-name').type('Doe')
      cy.get('#postal-code').type('10001')
      cy.get('#continue').click()

      cy.contains('Finish').click()
      cy.contains('Thank you for your order').should('be.visible')
    })

    it('Negative - Empty First Name', () => {
      cy.get('#last-name').type('Doe')
      cy.get('#postal-code').type('10001')
      cy.get('#continue').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Negative - Empty Last Name', () => {
      cy.get('#first-name').type('John')
      cy.get('#postal-code').type('10001')
      cy.get('#continue').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Negative - Empty Postal Code', () => {
      cy.get('#first-name').type('John')
      cy.get('#last-name').type('Doe')
      cy.get('#continue').click()

      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Negative - All Fields Empty', () => {
      cy.get('#continue').click()
      cy.get('[data-test="error"]').should('be.visible')
    })

    it('Negative - Extremely Long Input', () => {
      const longText = 'A'.repeat(300)
      cy.get('#first-name').type(longText)
      cy.get('#last-name').type(longText)
      cy.get('#postal-code').type(longText)
      cy.get('#continue').click()
    })

    it('Negative - Direct Access to Checkout URL without login', () => {
      cy.clearCookies()
      cy.visit('https://www.saucedemo.com/checkout-step-one.html', {
    failOnStatusCode: false})
      cy.get('.error-message-container').should('contain', 'Epic sadface')
    })

  })

})