export default function CookieSettingsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Cookie Settings</h1>
      <p className="mb-4">
        Procezly uses cookies to enhance your experience. Below is a breakdown of the types of cookies we use and your options.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Types of Cookies</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li><strong>Essential Cookies:</strong> Required for basic functionality.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand user behavior.</li>
        <li><strong>Marketing Cookies:</strong> Used for personalized promotions (if applicable).</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Managing Your Preferences</h2>
      <p className="text-gray-700">
        You can manage your cookie preferences via your browser settings. Disabling some cookies may impact your experience on the site.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        For more information, contact us at support@procezly.com.
      </p>
    </main>
  );
}
