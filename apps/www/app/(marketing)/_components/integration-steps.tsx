export function IntegrationSteps() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
          <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <div className="relative">
                <svg
                  className="h-10 w-10 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Install on Outlook</title>
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                  1
                </div>
              </div>
            </div>
            <h3 className="mb-3 font-bold text-foreground text-xl">
              Install on Outlook
            </h3>
            <p className="text-muted-foreground">
              Add Galleo to Microsoft Outlook with a simple installation process
            </p>
          </div>
        </div>

        <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
          <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <div className="relative">
                <svg
                  className="h-10 w-10 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Login via Microsoft</title>
                  <rect x="3" y="3" width="8" height="8" fill="#F25022" />
                  <rect x="13" y="3" width="8" height="8" fill="#7FBA00" />
                  <rect x="3" y="13" width="8" height="8" fill="#00A4EF" />
                  <rect x="13" y="13" width="8" height="8" fill="#FFB900" />
                </svg>
                <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                  2
                </div>
              </div>
            </div>
            <h3 className="mb-3 font-bold text-foreground text-xl">
              Login via Microsoft
            </h3>
            <p className="text-muted-foreground">
              Securely authenticate with your existing Microsoft account
            </p>
          </div>
        </div>

        <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
          <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <div className="relative">
                <svg
                  className="h-10 w-10 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Start Using</title>
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                  3
                </div>
              </div>
            </div>
            <h3 className="mb-3 font-bold text-foreground text-xl">
              Start Using
            </h3>
            <p className="text-muted-foreground">
              Begin generating trademark responses instantly with one click
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
