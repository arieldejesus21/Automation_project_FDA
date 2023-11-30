// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getInitialCartCount', () => {
    return cy.get('.counter.qty').then(($counter) => {
        if (!$counter.hasClass('empty')) {
            return cy.get('.counter-number').invoke('text').then((text) => {
                return parseFloat(text) || 0; // Devuelve el número o 0 si no es un número
            });
        }
        return 0; // Devuelve 0 si el contador está vacío
    });
});

// -- Custom Command to Check Cart Counter --

//Este comando verifica que el contador del carrito de compras se haya actualizado al valor esperado después de realizar una acción, como añadir un producto al carrito.
Cypress.Commands.add('checkCartCounter', (expectedCount) => {
    cy.get('.counter-number').invoke('text').then((text) => {
        const count = parseFloat(text);
        expect(count).to.equal(expectedCount);
    });
});