export function LandingFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/50 py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} New Brain Factory. All rights reserved. Built with Next.js, Clerk, and Supabase.
        </p>
      </div>
    </footer>
  )
}
