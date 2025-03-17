export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white text-center py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-bold">Procezly</h3>
          <p className="mt-2 text-gray-400">Optimizing Kamishibai Audits with AI & Data Intelligence.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Company</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li><a href="/about" className="hover:text-blue-400 transition">About</a></li>
            <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
            <li><a href="/privacy-policy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold">Subscribe for Updates</h3>
          <div className="mt-2 flex space-x-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-2 text-gray-900 bg-gray-100 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-600"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="mt-6 text-gray-400">&copy; 2025 Procezly. A product by <span className="font-semibold">GNT Security</span>.</p>
    </footer>
  );
}
