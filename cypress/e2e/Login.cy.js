/// <reference types='Cypress' />

describe('Test cases for Login flow', () => {
    let dataUser; // Variable para almacenar los datos cargados desde el JSON

    before(() => {
        // Cargar los datos desde el archivo JSON
        cy.fixture('dataFDA.json').then((data) => {
            dataUser = data;
        });
    });

    beforeEach(() => {
        cy.visit('https://mcstaging.fahorro.com/')
        cy.wait(1000)
    })

    context('Login flow', () => {

        // LOG-001: Verificar que un usuario registrado pueda iniciar sesión
        it('LOG-001: Verify that an unregistered user can create an account', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get('#email').type(dataUser.email[3])
            cy.get('#pass').type(dataUser.password[0])

            //Hacer clic en botón "Iniciar sesión"
            cy.get('#send2').click()

            //Verifica que el logueo fue exitoso REVISAR CON EQUIPO
            cy.get('.box-information > .box-content > p').contains(dataUser.email[3])

        })

        // LOG-002: Verificar que no permita iniciar sesión cuando las credenciales son invalidas
        it('LOG-002: Verify that an unregistered user can create an account', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get('#email').type(dataUser.email[0])
            cy.get('#pass').type(dataUser.password[0])

            //Hacer clic en botón "Iniciar sesión"
            cy.get('#send2').click()

            //Verificar que aparezca mensaje de error
            cy.get('.message-error').should('exist')
        })

        // LOG-003: Verificar que no permita iniciar sesión con un email no registrado
        it('LOG-003: Verify that it does not allow logging in with an unregistered email address', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get('#email').type('noexiste@yopmail.com')
            cy.get('#pass').type(dataUser.password[0])

            //Hacer clic en botón "Iniciar sesión"
            cy.get('#send2').click()

            //Verificar que aparezca mensaje de error
            cy.get('.message-error').should('exist')
        })

        // LOG-004: Verificar que pemita realizar la Recuperación de Contraseña
        it('LOG-004: Verify that pemita performed the Password Recovery', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get('#login-form > .fieldset > .actions-toolbar > .secondary > .action > span').click()
            cy.get('#email_address').type(dataUser.email[3])
            cy.get('#send2').click() // Dar clic en 

            cy.get('.message-success').should('be.visible').should('have.text', 'Si hay una cuenta asociada con ariel.torres+6@omni.pro, recibirá un correo electrónico con un enlace para restablecer su contraseña.')

            //Muy factible que falle por los intentos
        })

        // LOG-005: Verificar que un usuario logueado pueda cerrar sesión
        it('LOG-005: Verify that a logged in user can log out', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get('#email').type(dataUser.email[3])
            cy.get('#pass').type(dataUser.password[0])

            //Hacer clic en botón "Iniciar sesión"
            cy.get('#send2').click()

            //Verifica que el logueo fue exitoso
            cy.get('.box-information > .box-content > p').contains(dataUser.email[3])

            //Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('[role="button"] > .action').click()

            //Dar clic en "Cerrar sesión"
            cy.get('.authorization-link > a').click()

            cy.get('.column > p').should('be.visible').should('have.text', 'Has cerrado la sesión e irás a nuestra página de inicio en 5 segundos.')
        })

        // LOG-006: Verificar que un usuario pueda cambiar su contraseña y loguearse nuevamente
        it('LOG-006: Verify that a user can change their password and log in again', () => {

        })

        // LOG-007: Verificar que permita iniciar sesión desde el carrito de compra
        it('LOG-007: Verify that it allows you to log in from the shopping cart', () => {

            cy.visit('https://mcstaging.fahorro.com/amobay-250-mg-en-suspension-oral-75-ml.html')

            //Agregar producto al carrito
            cy.wait(1000)
            cy.get('#product-addtocart-button').click()
            //Abrir carrito de compra
            cy.wait(2000)
            cy.get('.showcart').click()
            //Dar clic en botón "Pagar"
            cy.get('#top-cart-btn-checkout').click()

            cy.get('#customer-email').type(dataUser.email[3])
            cy.get('.password').type(dataUser.password[0])

            //Dar clic en Iniciar sesión
            cy.get('#send2').click()

            //Verifica que sea visible el SUMMARY
            cy.wait(2000)
            cy.get('.opc-block-summary').should('be.visible')

        })
    })
})
