Cypress.Commands.add('loginAdmin', (email = 'admin@techinventory.com', password = 'Admin1234!') => {
  cy.visit('/admin/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 15000 }).should('include', '/admin/dashboard');
});
