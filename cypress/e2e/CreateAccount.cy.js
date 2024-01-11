/// <reference types='Cypress' />

describe('Test cases for Create Account flow', () => {

    beforeEach(() => {
        cy.visit('https://mcstaging.fahorro.com/')
        cy.wait(1000)
    })

    context('Create Account flow', () => {

        // CRE-001: Verificar que un usuario no registrado pueda crear una cuenta
        it('CRE-001: Verify that an unregistered user can create an account', () => {

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
                    });
                });
            });

            cy.get('#terms_and_conditions').check()

            // Hacer clic en "Crear cuenta" del formulario
            cy.get('#send2').click()

            //Verifica que la cuenta se haya creado correctamente
            cy.get('.message-success').should('be.visible')
        })

        // CRE-002: Verificar que un usuario registrado no pueda crear una cuenta
        it('CRE-002: Verify that a registered user cannot create an account', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()

            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.customer-account-create-link').click()

            cy.generate_firstname_and_lastname().then(names => {
                cy.generate_random_date().then(dates => {

                    const { firstName, lastName } = names
                    const { month, day, year } = dates

                    cy.get('#firstname').type(firstName)
                    cy.get('#lastname').type(lastName)

                    //Obtendo los datos de correo y contraseña utilizado en el caso pasado
                    cy.get_credentials_email_and_password().then(credentials => {

                        const { email, password } = credentials

                        cy.get('#email_address').type(email)
                        cy.get('#password').type(password)
                        cy.get('#password-confirmation').type(password)
                    });

                    cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                    cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                    cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                    cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                });
            });

            cy.get('#terms_and_conditions').check()

            // Hacer clic en "Crear cuenta" del formulario
            cy.get('#send2').click()

            //Verifica que la cuenta se haya creado correctamente
            cy.get('.message-error').should('be.visible')
        })

        // CRE-004: Verificar que no se pueda crear cuenta cuando haya un campo obligatorio sin diligenciar
        it('CRE-004: Verify that an account cannot be created when a mandatory field is not filled in', () => {

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
                        //cy.get('#email_address').type(email)
                        cy.get('#password').type(password)
                        cy.get('#password-confirmation').type(password)

                        cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                        cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                        cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                        cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                    });
                });
            });

            // Hacer clic en "Crear cuenta" del formulario
            cy.get('#send2').click()

            //Verificar que aparezca mensaje de error
            cy.get('#email_address-error').should('exist').should('have.text', 'Este es un campo obligatorio.')

        })

        // CRE-006: Verificar que la contraseña este oculta por defecto
        it('CRE-006: Verify that the password is hidden by default.', () => {

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

                        cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                        cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                        cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                        cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                        cy.get('#terms_and_conditions').check()

                        // Rellenar el formulario de registro con datos para verificar la contraseña
                        cy.get('#password').type(password).should('have.attr', 'type', 'password')
                        cy.get('#password-confirmation').type(password).should('have.attr', 'type', 'password')
                    });
                });
            });
        })

        // CRE-008: Verificar mensaje de error cuando la contraseña no coincide
        it('CRE-008 Verify error message when the password does not match', () => {

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

                        cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                        cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                        cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                        cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                        cy.get('#terms_and_conditions').check()

                        // Rellenar el formulario de registro con datos para verificar la contraseña
                        cy.get('#password').type(password).should('have.attr', 'type', 'password')
                        cy.get('#password-confirmation').type(password + "01").should('have.attr', 'type', 'password')
                    });
                });
            });

            // Hacer clic en "Crear cuenta" del formulario
            cy.get('#send2').click()

            //Verificar que aparezca mensaje de error
            cy.get('#password-confirmation-error').should('exist').should('have.text', 'Introduce el mismo valor otra vez.')
        })

        // CRE-010: Verificar que se presente mensaje de error cuando la contraseña no cumpla con el mínimo de longitud
        it('CRE-010: Verify that an error message is displayed when the password does not meet the minimum length.', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()

            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.customer-account-create-link').click()

            cy.generate_firstname_and_lastname().then(names => {
                cy.generate_email_and_password().then(credentials => {
                    cy.generate_random_date().then(dates => {
                        cy.generate_password_wrong_length().then(passwordWrongLength => {

                            const { email } = credentials
                            const { firstName, lastName } = names
                            const { month, day, year } = dates

                            cy.get('#firstname').type(firstName)
                            cy.get('#lastname').type(lastName)
                            cy.get('#email_address').type(email)

                            cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                            cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                            cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                            cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                            cy.get('#password').type(passwordWrongLength)

                            cy.wait(700)

                            //Verificar que aparezca mensaje de error //Debe tener todo el mensaje para verificar que esté en español
                            cy.get('#password-error').should('exist').should('have.text', 'La longitud mínima de este campo debe ser igual o mayor que 8 símbolos. Los espacios iniciales y finales serán ignorados.')

                        });
                    });
                });
            });
        })

        // CRE-011: Verificar que se presente mensaje de error cuando la contraseña no cumpla con las diferentes clases de caracteres
        it('CRE-011: Verify that an error message is displayed when the password does not comply with the different character classes.', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODAL
            cy.get('.customer-welcome > .action').click()

            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.customer-account-create-link').click()

            cy.generate_firstname_and_lastname().then(names => {
                cy.generate_email_and_password().then(credentials => {
                    cy.generate_random_date().then(dates => {
                        cy.generate_password_wrong_character().then(passwordWrongCharacter => {

                            const { email } = credentials
                            const { firstName, lastName } = names
                            const { month, day, year } = dates

                            cy.get('#firstname').type(firstName)
                            cy.get('#lastname').type(lastName)
                            cy.get('#email_address').type(email)

                            cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
                            cy.get('.ui-datepicker-year').should('be.visible').select(year.toString()) // Fecha de nacimiendo
                            cy.get('.ui-datepicker-month').should('be.visible').select(month) // Fecha de nacimiendo
                            cy.get('.ui-state-default').contains(day).click() // Fecha de nacimiendo

                            cy.get('#password').type(passwordWrongCharacter)

                            cy.wait(700)

                            //Verificar que aparezca mensaje de error //Debe tener todo el mensaje para verificar que esté en español
                            cy.get('#password-error').should('exist').should('have.text', 'El mínimo de diferentes clases de caracteres en la contraseña es 3. Clases de caracteres: minúsculas, mayúsculas, dígitos, caracteres especiales.')
                        });
                    });
                });
            });
        })

        /*
        // CRE-013: Verificar creación de cuenta con Monedero del Ahorro
        it('CRE-013: Verify account creation with Savings Wallet', () => {

            // Hacer clic en el botón "Mi Cuenta" para abrir el MODALS
            cy.get('.customer-welcome > .action').click()
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.customer-account-create-link > span').click()

            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.name[0])
            cy.get('#lastname').type(dataUser.lastName[0])
            cy.get('#email_address').type(dataUser.email[2])
            cy.get('#password').type(dataUser.password[0])
            cy.get('#password-confirmation').type(dataUser.password[0])

            cy.get('#dob').click().should('be.visible') // Fecha de nacimiendo
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.birthdate[0]) // Fecha de nacimiendo
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.birthdate[1]) // Fecha de nacimiendo
            cy.get('.ui-state-default:eq(4)').click() // Fecha de nacimiendo

            cy.get('#monedero').type(dataUser.wallet[0]) // Monedero del ahorro
            //cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click()

            cy.get('#terms_and_conditions').check()

            // Hacer clic en "Crear cuenta" del formulario
            cy.get('#send2').click()

            //Verifica que la cuenta se haya creado correctamente
            cy.get('.message-success').should('be.visible')

            // Verifica que el monedero esté asociado
            cy.get('.account-nav > .items > .nav > a').click()
            cy.get('tbody > tr > :nth-child(1)').should('have.text', dataUser.wallet[0])
        })
        */

        // CRE-014: Verificar que aceptar la política de privacidad de datos sea obligatorio
        it('CRE-014: Verify that accepting the data privacy policy is mandatory', () => {

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
                    });
                });
            });

            //cy.get('#terms_and_conditions').check()

            // Hacer clic en "Crear cuenta" del formulario
            cy.get('#send2').click()

            cy.get('#terms_and_conditions-error').should('be.visible')
        })
    })
})
