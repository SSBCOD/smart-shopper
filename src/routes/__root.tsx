import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Бет табылмады
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Сіз іздеген бет табылмады немесе жойылған.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Басты бетке оралу
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Smart Shop — Ақылды сатып алу тізімі" },
      { name: "description", content: "Smart Shopping List — сатып алуларды жоспарлауға арналған интернет-дүкен" },
      { property: "og:title", content: "Smart Shop — Ақылды сатып алу тізімі" },
      { name: "twitter:title", content: "Smart Shop — Ақылды сатып алу тізімі" },
      { property: "og:description", content: "Smart Shopping List — сатып алуларды жоспарлауға арналған интернет-дүкен" },
      { name: "twitter:description", content: "Smart Shopping List — сатып алуларды жоспарлауға арналған интернет-дүкен" },
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
