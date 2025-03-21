export default function Footer() {
  return (
    <footer className="bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Left Section: Branding & Socials */}
        <div className="w-full md:w-1/3">
          <h3 className="text-xl font-bold text-gray-900">Procezly</h3>
          <p className="text-gray-600 mt-2">
            Join our newsletter to stay up to date on features and releases.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>

        {/* Right Section: Newsletter Signup */}
        <div className="w-full md:w-1/3">
          <form className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
              Subscribe
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-2">
            By subscribing you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and consent to receive updates from our company.
          </p>
        </div>
      </div>

      {/* Bottom Section: Copyright & Legal Links */}
      <div className="w-full max-w-[1400px] mx-auto mt-10 px-6 flex flex-col md:flex-row justify-between items-center border-t pt-6">
        <p className="text-gray-500 text-sm">&copy; 2025 Procezly. All rights reserved. a product of GNT Security.</p>
        <div className="flex space-x-4 text-sm">
          <a href="/privacy-policy" className="text-gray-500 hover:underline">Privacy Policy</a>
          <a href="/terms" className="text-gray-500 hover:underline">Terms of Service</a>
          <a href="/cookies" className="text-gray-500 hover:underline">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
