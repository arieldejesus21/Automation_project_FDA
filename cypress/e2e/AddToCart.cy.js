/// <reference types='Cypress' />

describe('Test cases for Add To Cart', () => {
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

    context('Add To Cart flow', () => {

        // ADDP-001: Verificar que permita añadir un Producto al Carrito desde la Página de categorias (PLP) - Guest
        it('ADDP-001: Verify that it allows you to add a Product to the Cart from the Category Page (PLP) - Guest', () => {

            cy.getInitialCartCount().then((initialCount) => {

                //Dar clic en el Menú
                cy.get('.fa').click()
                cy.wait(1000)

                //Dar clic en la categoría
                cy.get('.ammenu-text').contains('Bebidas').click()

                //Guardo el nombre del producto
                cy.get('.product-item-actions').find('input').filter((index, element) => element.value === '29726').parents('.product-item-details').find('a').invoke('text').as('saveNameTest')
                //Dar clic en "Agregar al carrito"
                cy.get('.product-item-actions').find('input').filter((index, element) => element.value === '29726').parent().contains('Agregar al carrito').click();

                //Espera para que se agregue el producto
                cy.wait(2000)

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)

                //Abre el carrito de compras
                cy.get('.showcart').click()

                //Verificar que el producto se haya agregado mediante el nombre del producto
                cy.get('@saveNameTest').then((nameText) => {
                    cy.get('.minicart-items-wrapper').find('a').contains(nameText.trim())
                });
            })
        })

        // ADDP-002: Verificar que permita añadir un Producto al Carrito desde la Página de Detalle de Producto (PDP) - Guest
        it('ADDP-002: Verify that it allows adding a Product to the Cart from the Product Detail Page (PDP) - Guest', () => {

            cy.getInitialCartCount().then((initialCount) => {

                //Visitar página de producto
                cy.visit("https://mcstaging.fahorro.com/producto-qa-omni-2.html")
                cy.wait(2000)

                //Agregar producto al carrito de compra
                cy.get('#product-addtocart-button').click()

                //Verificar mensaje de confirmación
                cy.get('.message-success').should("be.visible").contains("a tu carrito de compra.")

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)
            })
        })

        // ADDP-004: Verificar que permita añadir Múltiples Unidades de un Producto al Carrito - Guest
        it('ADDP-004: Verify that it allows adding Multiple Units of a Product to the Cart - Guest', () => {

            //Genera número aleatorio del 2 al 10
            let randomNumber = Math.floor(Math.random() * 9) + 2;

            cy.getInitialCartCount().then((initialCount) => {

                //Visitar página de producto
                cy.visit("https://mcstaging.fahorro.com/producto-qa-omni-2.html")
                cy.wait(2000)

                //Añadir 5 unidades del producto al carrito de compras
                cy.get('#qty').clear().type(randomNumber)

                //Agregar producto al carrito de compra
                cy.get('#product-addtocart-button').click()

                //Verificar mensaje de confirmación
                cy.get('.message-success').should("be.visible").contains("a tu carrito de compra.")

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + randomNumber)
            })
        })

        // ADDP-005: Verificar que permita añadir un Producto al Carrito y Continuar Comprando - Guest
        it('ADDP-005: Verify that it allows you to add a Product to the Cart and Continue Shopping - Guest', () => {

            cy.getInitialCartCount().then((initialCount) => {

                //Visitar página de producto
                cy.visit("https://mcstaging.fahorro.com/producto-qa-omni-2.html")
                cy.wait(2000)

                //Agregar producto al carrito de compra
                cy.get('#product-addtocart-button').click()

                //Verificar mensaje de confirmación
                cy.get('.message-success').should("be.visible").contains("a tu carrito de compra.")

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)

                //Abre el MiniCart
                cy.get('.showcart').click()

                //Clic en botón "Ver carrito"
                cy.get('.minicart-wrapper').contains("Ver carrito").click()

                //Clic en botón "Seguir comprando"
                cy.get('.continue').click()

                //Verifica que esté en la página principal
                cy.url().should('include', '/')
            })
        })

        // ADDP-006: Verificar que permita añadir un Producto al Carrito desde la Página de categorias (PLP) - Login
        it('ADDP-006: Verify that it allows you to add a Product to the Cart from the Category Page (PLP) - Login', () => {

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

            //Se vacía carrito de compras
            cy.visit("https://mcstaging.fahorro.com/checkout/cart/")
            cy.wait(1000)

            cy.get('body').then((body) => {
                if (body.find('#empty_cart_button').length > 0) {

                    cy.get('#empty_cart_button').click()
                    cy.get('.action-primary').should("be.visible").click()
                    cy.get('.cart-empty > :nth-child(1)').should("be.visible").contains("No tienes artículos en tu carrito de compra")
                }
            });

            cy.getInitialCartCount().then((initialCount) => {

                //Dar clic en el Menú
                cy.wait(1000)
                cy.get('.fa').click()
                cy.wait(1000)

                //Dar clic en la categoría
                cy.get('.ammenu-text').contains('Bebidas').click()

                //Guardo el nombre del producto
                cy.get('.product-item-actions').find('input').filter((index, element) => element.value === '29726').parents('.product-item-details').find('a').invoke('text').as('saveNameTest')
                //Dar clic en "Agregar al carrito"
                cy.get('.product-item-actions').find('input').filter((index, element) => element.value === '29726').parent().contains('Agregar al carrito').click();

                //Espera para que se agregue el producto
                cy.wait(2000)

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)

                //Abre el carrito de compras
                cy.get('.showcart').click()

                //Verificar que el producto se haya agregado mediante el nombre del producto
                cy.get('@saveNameTest').then((nameText) => {
                    cy.get('.minicart-items-wrapper').find('a').contains(nameText.trim())
                });
            })
        })

        // ADDP-007: Verificar que permita añadir un Producto al Carrito desde la Página de Detalle de Producto (PDP) - Login
        it('ADDP-007: Verify that it allows adding a Product to the Cart from the Product Detail Page (PDP) - Login', () => {

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

            //Se vacía carrito de compras
            cy.visit("https://mcstaging.fahorro.com/checkout/cart/")
            cy.wait(1000)

            cy.get('body').then((body) => {
                if (body.find('#empty_cart_button').length > 0) {

                    cy.get('#empty_cart_button').click()
                    cy.get('.action-primary').should("be.visible").click()
                    cy.get('.cart-empty > :nth-child(1)').should("be.visible").contains("No tienes artículos en tu carrito de compra")
                }
            });

            cy.getInitialCartCount().then((initialCount) => {

                //Visitar página de producto
                cy.visit("https://mcstaging.fahorro.com/prueba-omni-qa-3.html")
                cy.wait(2000)

                //Agregar producto al carrito de compra
                cy.get('#product-addtocart-button').click()

                //Verificar mensaje de confirmación
                cy.get('.message-success').should("be.visible").contains("a tu carrito de compra.")

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)
            })

        })

        // ADDP-009: Verificar que permita añadir Múltiples Unidades de un Producto al Carrito - Login
        it('ADDP-009: Verify that it allows adding Multiple Units of a Product to the Cart - Login', () => {

            //Genera número aleatorio del 2 al 10
            let randomNumber = Math.floor(Math.random() * 9) + 2;

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

            //Se vacía carrito de compras
            cy.visit("https://mcstaging.fahorro.com/checkout/cart/")
            cy.wait(1000)

            cy.get('body').then((body) => {
                if (body.find('#empty_cart_button').length > 0) {

                    cy.get('#empty_cart_button').click()
                    cy.get('.action-primary').should("be.visible").click()
                    cy.get('.cart-empty > :nth-child(1)').should("be.visible").contains("No tienes artículos en tu carrito de compra")

                }
            });

            cy.getInitialCartCount().then((initialCount) => {

                //Visitar página de producto
                cy.visit("https://mcstaging.fahorro.com/prueba-omni-qa-3.html")
                cy.wait(2000)

                //Añadir 5 unidades del producto al carrito de compras
                cy.get('#qty').clear().type(randomNumber)

                //Agregar producto al carrito de compra
                cy.get('#product-addtocart-button').click()

                //Verificar mensaje de confirmación
                cy.get('.message-success').should("be.visible").contains("a tu carrito de compra.")

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + randomNumber)
            })
        })

        // ADDP-010: Verificar que permita añadir un Producto al Carrito y Continuar Comprando - Login
        it('ADDP-010: Verify that it allows you to add a Product to the Cart and Continue Shopping - Login', () => {

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

            //Se vacía carrito de compras
            cy.visit("https://mcstaging.fahorro.com/checkout/cart/")
            cy.wait(1000)

            cy.get('body').then((body) => {
                if (body.find('#empty_cart_button').length > 0) {

                    cy.get('#empty_cart_button').click()
                    cy.get('.action-primary').should("be.visible").click()
                    cy.get('.cart-empty > :nth-child(1)').should("be.visible").contains("No tienes artículos en tu carrito de compra")
                }
            });

            cy.getInitialCartCount().then((initialCount) => {

                //Visitar página de producto
                cy.visit("https://mcstaging.fahorro.com/producto-qa-omni-2.html")
                cy.wait(2000)

                //Agregar producto al carrito de compra
                cy.get('#product-addtocart-button').click()

                //Verificar mensaje de confirmación
                cy.get('.message-success').should("be.visible").contains("a tu carrito de compra.")

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)

                //Abre el MiniCart
                cy.get('.showcart').click()

                //Clic en botón "Ver carrito"
                cy.get('.minicart-wrapper').contains("Ver carrito").click()

                //Clic en botón "Seguir comprando"
                cy.get('.continue').click()

                //Verifica que esté en la página principal
                cy.url().should('include', '/')

            })
        })
    })
})
