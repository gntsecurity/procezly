export default function CheckEmail() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600">
          We have sent a confirmation email. Please check your inbox and follow
          the instructions to activate your account.
        </p>
      </div>
    </div>
  );
}
