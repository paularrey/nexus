export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Ravecard legal</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated August 2026
        </p>
      </header>

      <div className="space-y-7 rounded-[28px] border border-border bg-card p-6 leading-7 text-muted-foreground md:p-10">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Using Ravecard
          </h2>
          <p className="mt-2">
            Ravecard is a wallet experience for managing everyday payment tasks. By
            using the app, you agree to use it lawfully and keep your account
            details secure.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Demo services
          </h2>
          <p className="mt-2">
            This preview uses mock balances, rates, verification results,
            notifications, and payment actions. Nothing shown here is a live
            financial offer or a completed transaction.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Your account
          </h2>
          <p className="mt-2">
            You are responsible for activity performed through your account and
            for keeping authentication details private. Contact support if you
            believe an account action was not authorized.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Changes and contact
          </h2>
          <p className="mt-2">
            We may update these terms as the service evolves. Continued use
            after an update means you accept the revised terms. Questions can be
            directed to the Ravecard support team.
          </p>
        </section>
      </div>
    </article>
  );
}
