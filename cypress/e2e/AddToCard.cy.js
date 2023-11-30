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
        it.only('ADDP-001: Verify that it allows you to add a Product to the Cart from the Category Page (PLP) - Guest', () => {

            cy.getInitialCartCount().then((initialCount) => {

                //Dar clic en el Menú
                cy.get('.fa').click()
                cy.wait(1000)

                //Dar clic en la categoría
                cy.get('.ammenu-text').contains('Bebidas').click()

                //Guardo el nombre del producto
                cy.get('.product-item-actions').find('input').filter((index, element) => element.value === '317').parent().invoke('attr', 'data-product-sku').as('saveNameTest')

                //Dar clic en "Agregar al carrito"
                cy.get('.product-item-actions').find('input').filter((index, element) => element.value === '317').parent().contains('Agregar al carrito').click();

                //Espera para que se agregue el producto
                cy.wait(2000)

                //Utiliza el comando personalizado para verificar que el contador del carrito se ha actualizado
                cy.checkCartCounter(initialCount + 1)

                //Abre el carrito de compras
                cy.get('.showcart').click()

                //Verificar que el producto se haya agregado mediante el nombre del producto
                cy.get('@saveNameTest').then((nameText) => {
                    cy.get('.minicart-items-wrapper').find('a').contains(nameText)
                });

            })

        })

    })
})
