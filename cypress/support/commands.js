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

let credentials_email_and_password;

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
        const count = parseFloat(text)
        expect(count).to.equal(expectedCount)
    });

});

Cypress.Commands.add('generate_email_and_password', () => {

    const uuid = () => Cypress._.random(0, 1e6)
    const email = `fda_${uuid()}@automation.com`
    const password = `Contraseña0%_${uuid()}`

    return { email, password }
});

Cypress.Commands.add('generate_firstname_and_lastname', () => {

    const firstName = generate_name()
    const lastName = generate_name()

    return { firstName, lastName }
});

function generate_name() {

    const letras = 'abcdefghijklmnopqrstuvwxyz'

    let nombre = ''
    for (let i = 0; i < 4; i++) {  // Asegura una longitud mínima de 4 caracteres
        nombre += letras.charAt(Math.floor(Math.random() * letras.length))
    }

    return nombre.charAt(0).toUpperCase() + nombre.slice(1) // Capitaliza la primera letra
}

Cypress.Commands.add('generate_random_date', () => {
    // Arreglo con las tres primeras letras de los nombres de los meses en español
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"]

    // Generar índice de mes aleatorio (0-11)
    const randomMonthIndex = Math.floor(Math.random() * 12)

    // Seleccionar el mes usando el índice aleatorio
    const randomMonth = months[randomMonthIndex]

    // Generar día aleatorio (1-28)
    const randomDay = Math.floor(Math.random() * 28) + 1

    // Generar año aleatorio (1970-2004)
    const randomYear = Math.floor(Math.random() * (2004 - 1970 + 1)) + 1970

    // Devolver la fecha generada
    return {
        month: randomMonth,
        day: randomDay,
        year: randomYear
    };
});

Cypress.Commands.add('set_credentials_email_and_password', (credentials) => {
    credentials_email_and_password = credentials;
});

Cypress.Commands.add('get_credentials_email_and_password', () => {
    return credentials_email_and_password;
});