import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import NewsletterForm from "@/components/home/NewsletterForm";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <main className="space-y-24">
      <HeroSection />

      {/* New Arrivals */}
      <section className="bg-brown-100 dark:bg-brown-900 py-16">
        <div className="container mx-auto px-4">
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-brown-100 dark:bg-brown-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-brown-900 dark:text-brown-100">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm sm:text-base text-brown-700 dark:text-brown-200">
              Find exactly what you’re looking for – from essentials to
              inspiration.
            </p>
          </div>
          <Categories />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brown-100 dark:bg-brown-700 py-16 px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-brown-900 dark:text-white">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-sm sm:text-base text-brown-800 dark:text-brown-200">
            Real feedback from real people. See what our customers love about
            shopping with us.
          </p>
        </div>
        <Testimonials />
      </section>

      {/* Newsletter */}
      <section className="bg-brown-200 dark:bg-brown-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-brown-900 dark:text-brown-100 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <NewsletterForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
