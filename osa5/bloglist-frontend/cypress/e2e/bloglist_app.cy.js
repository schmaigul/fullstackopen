describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Superuser',
      username: 'petteri',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  it('user can login', function() {
    cy.contains('Login to blog list').click()
    cy.get('#username').type('petteri')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Blogs')
  })

  it('fails with wrong credentials', function() {
    cy.contains('Login to blog list').click()
    cy.get('#username').type('marsu')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.get('.error').should('contain', 'Error: wrong credentials')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('petteri')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('first blog')
      cy.get('#author').type('petteri69')
      cy.get('#url').type('petterinblog.fi')
      cy.contains('create').click()
      cy.contains('first blog')
      cy.contains('petteri69')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('#title').type('first blog')
        cy.get('#author').type('petteri69')
        cy.get('#url').type('petterinblog.fi')
        cy.contains('create').click()
      })

      it('user can like a blog', function() {
        cy.contains('first blog').contains('view').click()
        cy.get('#likebutton').click()
        cy.contains('first blog').contains('1')
      })

      it('user can delete their own blog', function() {
        cy.contains('first blog').contains('view').click()
        cy.get('#deletebutton').click()
        cy.get('html').should('not.contain', 'petteri69')
      })

      describe('multiple blogs', function() {
        beforeEach(function() {
          cy.contains('new blog').click()
          cy.get('#title').type('second blog')
          cy.get('#author').type('petteri69')
          cy.get('#url').type('petterinblog.fi')
          cy.contains('create').click()

          cy.contains('second blog').contains('view').click()
          cy.get('#likebutton').click()
        })

        it('blogs are ordered according to likes', function() {
          cy.get('.blog').eq(0).should('contain', 'second blog')
          cy.get('.blog').eq(1).should('contain', 'first blog')
        })
      })
    })
  })
})