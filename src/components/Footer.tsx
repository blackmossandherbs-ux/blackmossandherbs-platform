/**
 * HECTIC Intellectual Property - Copyright 2024
 */
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import NewsletterForm from '@/components/NewsletterForm'

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
                            Your trusted UK source for premium wildcrafted sea moss, herbal blends, and holistic wellness solutions. Delivering nationwide.
                        </p>
                        <div className="flex space-x-4 mb-5">
                            <a href="https://www.facebook.com/blackmossandherbs" aria-label="Facebook" className="text-earth-300 hover:text-primary-400 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/blackmossandherbs" aria-label="Instagram" className="text-earth-300 hover:text-primary-400 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com/blackmossherbs" aria-label="X / Twitter" className="text-earth-300 hover:text-primary-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://www.youtube.com/@blackmossandherbs" aria-label="YouTube" className="text-earth-300 hover:text-primary-400 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                        {/* UK Trust Signals */}
                        <div className="space-y-1 text-xs text-earth-500">
                            <p>🇬🇧 Proudly UK-based</p>
                            <p>Registered in England & Wales</p>
                            <p>ICO Registered · Data Protection</p>
                            <p>All prices include VAT where applicable</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shop" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Shop Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/subscriptions" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Subscriptions
                                </Link>
                            </li>
                            <li>
                                <Link href="/library" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Digital Library
                                </Link>
                            </li>
                            <li>
                                <Link href="/consultations" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Book Consultation
                                </Link>
                            </li>
                            <li>
                                <Link href="/membership" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Membership
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Customer Care</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/legal/delivery" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Delivery Information
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/returns" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-earth-300 hover:text-primary-400 transition-colors">
                                    Blog & Articles
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Newsletter</h4>
                        <p className="text-earth-300 text-sm mb-4">
                            Subscribe for wellness tips, UK herb news and exclusive member offers.
                        </p>
                        <NewsletterForm layout="col" showMailIcon buttonLabel="Subscribe" />
                    </div>
                </div>

                <div className="border-t border-earth-800 mt-8 pt-8 text-sm text-earth-400">
                    {/* MHRA-compliant disclaimer */}
                    <p className="max-w-3xl mx-auto mb-6 italic text-center text-xs leading-relaxed">
                        These products have not been evaluated by the Medicines and Healthcare products Regulatory Agency (MHRA). Our products are food supplements intended for general wellbeing and traditional herbal use only. They are not intended to diagnose, treat, cure or prevent any disease. Always consult a qualified healthcare professional before starting any supplement, especially if you are pregnant, breastfeeding or taking medication.
                    </p>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} Black Moss & Herbs. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <Link href="/legal/privacy" className="hover:text-primary-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/legal/terms" className="hover:text-primary-400 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/legal/cookies" className="hover:text-primary-400 transition-colors">
                                Cookie Policy
                            </Link>
                            <Link href="/legal/returns" className="hover:text-primary-400 transition-colors">
                                Returns Policy
                            </Link>
                            <Link href="/legal/delivery" className="hover:text-primary-400 transition-colors">
                                Delivery Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
