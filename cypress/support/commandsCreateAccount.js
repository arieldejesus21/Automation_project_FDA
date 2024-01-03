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

// -- Custom Command to Check Cart Counter --

//Genera correo y contraseña validos
Cypress.Commands.add('generate_email_and_password', () => {

    const uuid = () => Cypress._.random(0, 1e6)
    const email = `fda_${uuid()}@automation.com`
    const password = `Contraseña0%_${uuid()}`

    return { email, password }
});

//Genera una contraseña no valida (clases de caracteres: minúsculas, mayúsculas, dígitos, caracteres especiales.)
Cypress.Commands.add('generate_password_wrong_character', () => {

    const uuid = () => Cypress._.random(0, 1e6)
    const passwordWrongCharacter = `contrasena${uuid()}`

    return passwordWrongCharacter
});

//Genera una contraseña no valida (menos de 7 caracteres)
Cypress.Commands.add('generate_password_wrong_length', () => {
    // Función para generar un número aleatorio con un máximo de 4 dígitos
    const uuid = () => Cypress._.random(0, 9999)
    const passwordWrongLength = `C0%_${uuid()}`.substring(0, 7)

    return passwordWrongLength
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
    credentials_email_and_password = credentials
});

Cypress.Commands.add('get_credentials_email_and_password', () => {
    return credentials_email_and_password
});