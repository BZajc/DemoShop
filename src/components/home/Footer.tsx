export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="font-semibold mb-2 text-gray-100 dark:text-gray-50">
            DemoShop
          </h3>
          <p>© {new Date().getFullYear()} DemoShop. All rights reserved.</p>
        </div>
        <nav className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="/about"
            className="hover:text-gray-100 dark:hover:text-gray-50"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="hover:text-gray-100 dark:hover:text-gray-50"
          >
            Contact
          </a>
          <a
            href="/terms"
            className="hover:text-gray-100 dark:hover:text-gray-50"
          >
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  );
}
