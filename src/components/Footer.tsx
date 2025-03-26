export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } else {
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="w-full md:w-1/3">
          <img
            src="/logo.png"
            alt="Procezly Logo"
            className="h-8 w-auto"
          />
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

        <div className="w-full md:w-1/3">
          <form onSubmit={handleSubscribe} className="flex space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Subscribe"}
            </button>
          </form>
          {subscribed && (
            <p className="text-green-600 text-sm mt-2 font-medium">
              ✅ Subscribed! Check your email.
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            By subscribing you agree to our{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and consent to receive updates from our company.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto mt-10 px-6 flex flex-col md:flex-row justify-between items-center border-t pt-6">
        <p className="text-gray-500 text-sm">
          &copy; 2025 Procezly. All rights reserved. A product of GNT Security.
        </p>
        <div className="flex space-x-4 text-sm">
          <a href="/privacy-policy" className="text-gray-500 hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="text-gray-500 hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
