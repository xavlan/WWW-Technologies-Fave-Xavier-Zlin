describe('TechInventory Public Search', () => {
  beforeEach(() => {
    cy.visit('/components');
  });

  it('search input filters components by name', () => {
    cy.get('[data-testid="search-input"]').type('Intel');
    cy.url().should('include', 'search=Intel');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('search input filters components by brand', () => {
    cy.get('[data-testid="search-input"]').type('NVIDIA');
    cy.url().should('include', 'search=NVIDIA');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('search input filters components by description', () => {
    cy.get('[data-testid="search-input"]').type('gaming');
    cy.url().should('include', 'search=gaming');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('search is case-insensitive', () => {
    cy.get('[data-testid="search-input"]').type('intel');
    cy.url().should('include', 'search=intel');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('clearing search input resets results', () => {
    cy.get('[data-testid="search-input"]').type('GPU');
    cy.get('[data-testid="search-input"]').clear();
    cy.url().should('not.include', 'search=');
  });

  it('search with no results shows empty state', () => {
    cy.get('[data-testid="search-input"]').type('nonexistentcomponent123');
    cy.get('[data-testid="empty-state"]').should('exist');
  });

  it('empty state has reset filters button', () => {
    cy.get('[data-testid="search-input"]').type('nonexistentcomponent123');
    cy.get('[data-testid="empty-state"]').within(() => {
      cy.get('[data-testid="reset-filters-button"]').should('exist');
    });
  });

  it('search persists across pagination', () => {
    cy.get('[data-testid="search-input"]').type('Intel');
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="pagination-next"]').length) {
        cy.get('[data-testid="pagination-next"]').click();
        cy.url().should('include', 'search=Intel');
        cy.url().should('include', 'page=2');
      }
    });
  });
});
