describe('TechInventory Public Component Detail', () => {
  it('clicking a product card navigates to detail page', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.url().should('match', /\/components\/[\w-]+$/);
  });

  it('detail page shows correct component information', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.get('[data-testid="component-name"]').should('exist');
    cy.get('[data-testid="component-brand"]').should('exist');
    cy.get('[data-testid="component-model"]').should('exist');
    cy.get('[data-testid="component-category"]').should('exist');
    cy.get('[data-testid="component-sku"]').should('exist');
    cy.get('[data-testid="component-price"]').should('exist');
    cy.get('[data-testid="component-stock"]').should('exist');
  });

  it('detail page shows component image', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.get('[data-testid="component-image"]').should('exist');
  });

  it('detail page shows technical specifications', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.get('[data-testid="specifications-table"]').should('exist');
  });

  it('detail page shows description section', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.get('[data-testid="component-description"]').should('exist');
  });

  it('back to catalog link works', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.get('[data-testid="back-to-catalog-link"]').click();
    cy.url().should('include', '/components');
  });

  it('breadcrumb navigation works', () => {
    cy.visit('/components');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="view-details-link"]').click();
    });
    cy.get('[data-testid="breadcrumb"]').should('exist');
    cy.get('[data-testid="breadcrumb-home"]').click();
    cy.url().should('eq', '/');
  });

  it('detail page handles invalid component ID', () => {
    cy.visit('/components/invalid-id-12345');
    cy.get('[data-testid="not-found-message"]').should('exist');
  });
});
