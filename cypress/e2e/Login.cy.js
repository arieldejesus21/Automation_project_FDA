/// <reference types='Cypress' />

describe('Test cases for Login flow', () => {

    beforeEach(() => {
        cy.visit('https://mcstaging.fahorro.com/')
        cy.wait(1000)
    })

    context('Login flow', () => {

        // LOG-001: Verificar que un usuario registrado pueda iniciar sesión
        it('LOG-001: Verify that an unregistered user can create an account', () => {

            // PRE-CONDICION: CREACIÓN DE CUENTA
            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()

            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.customer-account-create-link').click()

            cy.generate_firstname_and_lastname().then(names => {
                cy.generate_email_and_password().then(credentials => {
                    cy.generate_random_date().then(dates => {

                        const { email, password } = credentials
                        const { firstName, lastName } = names
                        const { month, day, year } = dates

                        cy.get('#firstname').type(firstName)
                        cy.get('#lastname').type(lastName)
                        cy.get('#email_address').type(email)
                        cy.get('#password').type(password)
                        cy.get('#password-confirmation').type(password)

                        cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                        cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                        cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                        cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                        //Guardo los datos de email utilizado para usarlo en el siguiente caso
                        cy.set_credentials_email_and_password(credentials);
                        //cy.wrap(email).as('savedCredentials');

                        cy.get('#terms_and_conditions').check()

                        // Hacer clic en "Crear cuenta" del formulario
                        cy.get('#send2').click()

                        //Verifica que la cuenta se haya creado correctamente
                        cy.get('.message-success').should('be.visible')

                        //Clic en icono de MI CUENTA del Header
                        cy.get('[role="button"] > .action').click()

                        // Cerrar la sesión
                        cy.get('.authorization-link > a').click()

                        // Espera que Magento cierra la sesión
                        cy.wait(2000)

                        // FIN PRE-CONDICION: CREACIÓN DE CUENTA

                        // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
                        cy.get('.customer-welcome > .action').click()
                        // Hacer clic en el botón de "Iniciar sesion"
                        cy.get('.customer-sign-in-link > span').click()

                        cy.get('#email').type(email)
                        cy.get('#pass').type(password)

                        //Hacer clic en botón "Iniciar sesión"
                        cy.get('#send2').click()

                        //Verifica que el logueo fue exitoso
                        cy.get('.box-information > .box-content > p').contains(email)
                    });
                });
            });
        })

        // LOG-002: Verificar que no permita iniciar sesión cuando las credenciales son invalidas
        it('LOG-002: Verify that an unregistered user can create an account', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get_credentials_email_and_password().then(credentials => {

                const { email, password } = credentials

                cy.get('#email').type(email)
                cy.get('#pass').type(password + "001")
            });

            //Hacer clic en botón "Iniciar sesión"
            cy.get('#send2').click()

            //Verificar que aparezca mensaje de error
            cy.get('.message-error').should('exist')
        })

        // LOG-003: Verificar que no permita iniciar sesión con un email no registrado
        it('LOG-003: Verify that it does not allow logging in with an unregistered email address', () => {

            cy.get_credentials_email_and_password().then(credentials => {

                const { email, password } = credentials

                // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
                cy.get('.customer-welcome > .action').click()
                // Hacer clic en el botón de "Iniciar sesion"
                cy.get('.customer-sign-in-link > span').click()

                cy.get('#email').type('noexiste@yopmail.com')
                cy.get('#pass').type(password)

                //Hacer clic en botón "Iniciar sesión"
                cy.get('#send2').click()

                //Verificar que aparezca mensaje de error
                cy.get('.message-error').should('exist')
            });
        })

        // LOG-004: Verificar que permita realizar la Recuperación de Contraseña
        it('LOG-004: Verify that it allows you to perform Password Recovery', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get_credentials_email_and_password().then(credentials => {

                const { email, password } = credentials

                cy.get('#login-form > .fieldset > .actions-toolbar > .secondary > .action > span').click()
                cy.get('#email_address').type(email)
                cy.get('#send2').click()

                cy.get('.message-success').should('be.visible').contains('Si hay una cuenta asociada con ' + email + ', recibirá un correo electrónico con un enlace para restablecer su contraseña.')
                //Muy factible que falle por los intentos
            });
        })

        // LOG-005: Verificar que un usuario logueado pueda cerrar sesión
        it('LOG-005: Verify that a logged in user can log out', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Iniciar sesion"
            cy.get('.customer-sign-in-link > span').click()

            cy.get_credentials_email_and_password().then(credentials => {

                const { email, password } = credentials

                cy.get('#email').type(email)
                cy.get('#pass').type(password)

                //Hacer clic en botón "Iniciar sesión"
                cy.get('#send2').click()

                //Verifica que el logueo fue exitoso
                cy.get('.box-information > .box-content > p').contains(email)

                //Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
                cy.get('[role="button"] > .action').click()

                //Dar clic en "Cerrar sesión"
                cy.get('.authorization-link > a').click()

                cy.get('.column > p').should('be.visible').should('have.text', 'Has cerrado la sesión e irás a nuestra página de inicio en 5 segundos.')

            });
        })

        // LOG-006: Verificar que un usuario pueda cambiar su contraseña y loguearse nuevamente
        it('LOG-006: Verify that a user can change their password and log in again', () => {
            //EN PROCESO
        })

        // LOG-007: Verificar que permita iniciar sesión desde el carrito de compra
        it('LOG-007: Verify that it allows you to log in from the shopping cart', () => {

            cy.visit('https://mcstaging.fahorro.com/producto-qa-omni-2.html')

            cy.get_credentials_email_and_password().then(credentials => {

                const { email, password } = credentials

                //Agregar producto al carrito
                cy.wait(1000)
                cy.get('#product-addtocart-button').click()
                //Abrir carrito de compra
                cy.wait(2000)
                cy.get('.showcart').click()
                //Dar clic en botón "Pagar"
                cy.get('#top-cart-btn-checkout').click()

                cy.get('#customer-email').type(email)
                cy.get('.password').type(password)

                //Dar clic en Iniciar sesión
                cy.get('#send2').click()

                //Verifica que sea visible el SUMMARY
                cy.wait(2000)
                cy.get('.opc-block-summary').should('be.visible')
            });
        })
    })
})
