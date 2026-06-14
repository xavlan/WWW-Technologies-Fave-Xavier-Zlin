describe('TechInventory Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAdmin();
  });

  it('dashboard displays stats cards', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="stats-card"]').should('have.length.greaterThan', 0);
  });

  it('dashboard shows total components count', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="total-components-stat"]').should('exist');
  });

  it('dashboard shows total inventory value', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="total-value-stat"]').should('exist');
  });

  it('dashboard shows low stock items count', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="low-stock-stat"]').should('exist');
  });

  it('dashboard shows out of stock items count', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="out-of-stock-stat"]').should('exist');
  });

  it('dashboard displays low stock alert list', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="low-stock-alert-list"]').should('exist');
  });

  it('low stock items have links to inventory', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="low-stock-item"]').first().within(() => {
      cy.get('a').should('exist');
    });
  });

  it('dashboard has navigation to inventory', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="nav-inventory"]').click();
    cy.url().should('include', '/admin/inventory');
  });

  it('dashboard displays recent activity section', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="recent-activity"]').should('exist');
  });

  it('dashboard has quick action buttons', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="quick-add-component"]').should('exist');
  });

  it('quick add button navigates to new component form', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="quick-add-component"]').click();
    cy.url().should('include', '/admin/inventory/new');
  });

  it('dashboard loads without errors', () => {
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="dashboard-title"]').should('exist');
  });
});
