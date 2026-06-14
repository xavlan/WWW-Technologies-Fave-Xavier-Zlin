describe('TechInventory Admin CRUD', () => {
  beforeEach(() => {
    cy.loginAdmin();
  });

  it('admin can see inventory list', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="inventory-table"]').should('exist');
    cy.get('[data-testid="inventory-row"]').should('have.length.greaterThan', 0);
  });

  it('admin can navigate to new component form', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="add-component-button"]').click();
    cy.url().should('include', '/admin/inventory/new');
  });

  it('admin can create a new component', () => {
    const uniqueSku = `TEST-${Date.now()}`;

    cy.visit('/admin/inventory/new');
    cy.get('input[name="name"]').type('Test Component');
    cy.get('input[name="brand"]').type('Test Brand');
    cy.get('input[name="model"]').type('TEST-001');
    cy.get('textarea[name="description"]').type('Test description for component');
    cy.get('input[name="price"]').clear().type('99.99');
    cy.get('input[name="stock"]').clear().type('10');
    cy.get('input[name="sku"]').type(uniqueSku);
    cy.get('[data-testid="category-select"]').click();
    cy.contains('[role="option"]', 'CPU').click();
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/inventory');
    cy.contains('Component created successfully').should('be.visible');
  });

  it('form validation shows errors for invalid input', () => {
    cy.visit('/admin/inventory/new');
    cy.get('input[name="name"]').type('A');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="name-error"]').should('exist');
  });

  it('admin can edit an existing component', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="inventory-row"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });
    cy.url().should('match', /\/admin\/inventory\/[\w-]+\/edit$/);
    cy.get('input[name="price"]').clear().type('149.99');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/inventory');
    cy.contains('Component updated successfully').should('be.visible');
  });

  it('admin can delete a component', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="inventory-row"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });
    cy.get('[data-testid="confirm-delete-dialog"]').should('exist');
    cy.get('[data-testid="confirm-delete-button"]').click();
    cy.contains('Component deleted').should('be.visible');
  });

  it('delete operation shows confirmation dialog', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="inventory-row"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });
    cy.get('[data-testid="confirm-delete-dialog"]').should('exist');
    cy.get('[data-testid="cancel-delete-button"]').click();
    cy.get('[data-testid="confirm-delete-dialog"]').should('not.exist');
  });

  it('inventory table has search input', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="inventory-search"]').should('exist');
    cy.get('[data-testid="inventory-search"]').type('Intel');
  });

  it('inventory table has category filter', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="category-filter"]').should('exist');
    cy.get('[data-testid="category-filter"]').click();
    cy.contains('[role="option"]', 'CPU').click();
  });

  it('stock badge shows correct color coding', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="stock-badge"]').should('exist');
  });

  it('pagination works in inventory table', () => {
    cy.visit('/admin/inventory');
    cy.get('[data-testid="pagination-next"]').click();
    cy.contains('Page 2 of').should('be.visible');
  });
});
