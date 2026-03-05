describe('Users API Automation Suite', () => {

  const uniqueEmail = `fineboy${Date.now()}@zmail.com`
  const validPassword = "SecretSuper@987"

  // REGISTER

  describe('POST /users/register', () => {

    it('Successful Registration', () => {
      cy.request({
        method: 'POST',
        url: '/users/register',
        body: {
          first_name: "Fine",
          last_name: "Boy",
          address: {
            street: "12th Avenue",
            city: "Oshodi",
            state: "Lagos",
            country: "Nigeria",
            postal_code: "11232"
          },
          phone: "09090909090",
          dob: "1980-01-01",
          password: validPassword,
          email: uniqueEmail
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
      })
    })
  })

  // LOGIN

  describe('POST /users/login', () => {

    it('Valid Login', () => {
      cy.request('POST', '/users/login', {
        email: uniqueEmail,
        password: validPassword
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.access_token).to.exist
        expect(response.body.token_type).to.eq("bearer")
      })
    })
  })

  // CHANGE PASSWORD

  describe('POST /users/change-password', () => {

    it('Change Password Successfully', () => {

      cy.apiLogin(uniqueEmail, validPassword)
        .then((token) => {

          cy.request({
            method: 'POST',
            url: '/users/change-password',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: {
              current_password: validPassword,
              new_password: "welcome02",
              new_password_confirmation: "welcome02"
            }
          }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.success).to.be.true
          })
        })
    })

  })

  
  // FORGOT PASSWORD

  describe('POST /users/forgot-password', () => {

    it('Positive - Valid Email', () => {
      cy.request('POST', '/users/forgot-password', {
        email: uniqueEmail
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('Negative - Invalid Email', () => {
      cy.request({
        method: 'POST',
        url: '/users/forgot-password',
        failOnStatusCode: false,
        body: { email: "wrong@mail.com" }
      }).then((response) => {
        expect(response.status).to.not.eq(200)
      })
    })

  })

  
  // LOGOUT

  describe('GET /users/logout', () => {

    it('Logout Successfully', () => {
    //   cy.clearCookies()
      cy.apiLogin(uniqueEmail, validPassword)
        .then((token) => {

          cy.request({
            method: 'GET',
            url: '/users/logout',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((response) => {
            // expect(response.status).to.eq(200)
            expect(response.body.message).to.contain("Successfully logged out")
          })
        })
    })
})
})