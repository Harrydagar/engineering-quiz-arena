import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="border-t mt-12 py-6 text-center text-gray-500">
        Quiz Arena © 2026
      </footer>
    </>
  );
}

export default MainLayout;