/**
 * HECTIC Intellectual Property - Copyright 2024
 */
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-earth-950 border-t border-earth-800 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      <div className="container py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Black Moss & Herbs</h3>
            <p className="text-earth-300 text-sm mb-4">
              Your trusted source for premium herbal wellness products, education, and holistic
              health solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  href="/subscriptions"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Digital Library
                </Link>
              </li>
              <li>
                <Link
                  href="/consultations"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Blog & News
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Video Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-earth-300 hover:text-primary-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-earth-300 text-sm mb-4">
              Subscribe for wellness tips and exclusive offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg bg-earth-800 border border-earth-700 text-earth-100 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="btn-primary">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-earth-800 mt-8 pt-8 flex flex-col items-center text-center text-sm text-earth-400">
          <p className="max-w-3xl mb-4 italic">
            Disclaimer: These statements have not been evaluated by the FDA or any medical
            authority. Our products and protocols are for educational and traditional herbal
            purposes only. They are not intended to diagnose, treat, cure, or prevent any disease.
            Always consult with a qualified health professional.
          </p>
          <div className="flex flex-col md:flex-row justify-between w-full items-center">
            <p>&copy; 2024 Black Moss & Herbs. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="hover:text-primary-400 transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
