export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-indigo-50">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          Welcome to DevLinkVault
        </h1>
        <p className="text-lg text-gray-600">
          Effortlessly manage and share your developer links with the world. 🌎
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <a
            href="/login"
            className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-2 rounded-md bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition font-semibold"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
