export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        &copy; {year} PC Component Inventory. All rights reserved.
      </div>
    </footer>
  );
}
