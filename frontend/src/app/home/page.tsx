import "../globals.css"

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome to</h1>
      <h2 className="logo text-9xl bounce-subtle">RAPPORTÖR</h2>
      <h2 className="mt-4 text-2xl">The Intelligent Data Quality & Analytics Platform</h2>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 max-w-3xl mt-10">
        <h3 className="text-lg font-semibold mb-3">How to use the program</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Navigate through the top bar to access Reports, User page, or Settings.</li>
          <li>Click on “Reports” to view all available reports in the table.</li>
          <li>Use filters and search to quickly find the report you need.</li>
          <li>Click on individual reports to see more detailed information.</li>
          <li>Adjust settings to customize your experience or update preferences.</li>
        </ul>
      </div>
    </div>

  )
}
