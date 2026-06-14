describe('TechInventory Admin Auth', () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it('redirects unauthenticated users from dashboard to login', () => {
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/login');
  });

  it('redirects unauthenticated users from inventory to login', () => {
    cy.visit('/admin/inventory');
    cy.url().should('include', '/admin/login');
  });

  it('login with wrong credentials shows error message', () => {
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('admin@techinventory.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="error-alert"]').should('exist');
    cy.get('[data-testid="error-alert"]').should('contain', 'Invalid credentials');
  });

  it('login with correct credentials redirects to dashboard', () => {
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('admin@techinventory.com');
    cy.get('input[name="password"]').type('Admin1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/admin/dashboard');
  });

  it('login with non-existent user shows error message', () => {
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('nonexistent@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="error-alert"]').should('exist');
  });

  it('login form validates required fields', () => {
    cy.visit('/admin/login');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="email-error"]').should('exist');
    cy.get('[data-testid="password-error"]').should('exist');
  });

  it('login form validates email format', () => {
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="email-error"]').should('exist');
  });

  it('logout button clears session and redirects to login', () => {
    cy.loginAdmin();
    cy.visit('/admin/dashboard');
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/admin/login');
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/login');
  });

  it('authenticated user can access dashboard', () => {
    cy.loginAdmin();
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/admin/dashboard');
    cy.get('[data-testid="dashboard-title"]').should('exist');
  });

  it('authenticated user can access inventory', () => {
    cy.loginAdmin();
    cy.visit('/admin/inventory');
    cy.url().should('include', '/admin/inventory');
    cy.get('[data-testid="inventory-title"]').should('exist');
  });
});
