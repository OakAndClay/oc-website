import Paper from "../components/Paper";
import { paperSections } from "../content/paperContent";
import MarkdownContent from "../components/MarkdownContent";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500"></div>

        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/img/OakClay-Vector.svg')] bg-cover bg-center"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 mb-6 leading-tight">
            Custom Handcrafted Timber Frames and Affordable Kits
          </h1>
          <p className="font-roboto text-lg sm:text-xl text-stone-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Built with traditional mortise and tenon joinery from select species like Douglas Fir, White Oak, Yellow Cedar, and Cypress.
            Timeless quality for your dream retreat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cottage"
              className="inline-block px-8 py-4 bg-stone-800 text-white font-roboto font-semibold rounded-lg shadow-lg hover:bg-stone-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Our Kits
            </Link>
            <Link
              href="/custom-craft"
              className="inline-block px-8 py-4 bg-white text-stone-800 font-roboto font-semibold rounded-lg shadow-lg hover:bg-stone-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-stone-200"
            >
              Custom Craft
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-400 to-transparent"></div>
      </section>

      {/* Product Cards Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20">
        <h2 className="font-cinzel text-3xl sm:text-4xl text-center text-stone-800 mb-12">
          Our Timber Frame Kits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {paperSections.map(({ title, link, img, description }) => (
            <Paper key={title} className="transform transition-all duration-500 hover:shadow-2xl">
              <h2 className="font-cinzel text-3xl mb-4 text-stone-800">{title}</h2>
              {img && (
                <img
                  src={img}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                />
              )}
              <div className="text-stone-600 font-roboto leading-relaxed">
                <MarkdownContent content={description} />
              </div>
              <div className="mt-6 flex justify-end">
                <Link
                  href={link}
                  className="inline-block px-6 py-3 bg-stone-800 text-white font-roboto font-medium rounded-lg shadow-md hover:bg-stone-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Explore
                </Link>
              </div>
            </Paper>
          ))}
        </div>
      </section>
    </div>
  );
}
