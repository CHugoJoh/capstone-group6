import Image from "next/image"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top-bar flex items-center justify-between">
          <div className="logo flex items-center gap-2">
            <Image src="/ikea.png" alt="IKEA logo" width={50} height={50} />
            <a className="logo text-xl" href="home">RAPPORTÖR</a>
          </div>
          <nav className="flex space-x-2">
            <a className="hover:text-blue-500" href="reports">Reports</a>
            <a className="hover:text-blue-500" href="analytics">Analytics</a>
            <a className="hover:text-blue-500" href="settings">Settings</a>
          </nav>
        </header>

        {/* Page content */}
        <main className="container mx-auto py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
