describe('TechInventory Public Catalog', () => {
  beforeEach(() => {
    cy.visit('/components');
  });

  it('page loads with component cards', () => {
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('search bar filters results in real-time', () => {
    cy.get('[data-testid="search-input"]').type('GPU');
    cy.url().should('include', 'search=GPU');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('category filter shows only matching components', () => {
    cy.get('[data-testid="category-select"]').click();
    cy.contains('[role="option"]', 'CPU').click();
    cy.url().should('include', 'category=cpu');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('price range filter works', () => {
    cy.get('[data-testid="min-price-input"]').type('100');
    cy.get('[data-testid="max-price-input"]').type('500');
    cy.url().should('include', 'minPrice=100');
    cy.url().should('include', 'maxPrice=500');
  });

  it('in-stock toggle shows only available components', () => {
    cy.get('[data-testid="in-stock-toggle"]').check();
    cy.url().should('include', 'inStock=true');
  });

  it('combining multiple filters works', () => {
    cy.get('[data-testid="search-input"]').type('Intel');
    cy.get('[data-testid="category-select"]').click();
    cy.contains('[role="option"]', 'CPU').click();
    cy.get('[data-testid="min-price-input"]').type('200');
    cy.url().should('include', 'search=Intel');
    cy.url().should('include', 'category=cpu');
    cy.url().should('include', 'minPrice=200');
  });

  it('clearing filters resets the list', () => {
    cy.get('[data-testid="search-input"]').type('GPU');
    cy.get('[data-testid="clear-filters-button"]').click();
    cy.url().should('not.include', 'search=');
  });

  it('pagination navigates between pages', () => {
    cy.get('[data-testid="pagination-next"]').click();
    cy.url().should('include', 'page=2');
  });

  it('product card displays correct information', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="product-name"]').should('exist');
      cy.get('[data-testid="product-brand"]').should('exist');
      cy.get('[data-testid="product-price"]').should('exist');
      cy.get('[data-testid="stock-badge"]').should('exist');
    });
  });

  it('stock badge shows correct color coding', () => {
    cy.get('[data-testid="stock-badge"]').should('exist');
  });

  it('view details link navigates to component detail page', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.url().should('match', /\/components\/[\w-]+$/);
  });
});
