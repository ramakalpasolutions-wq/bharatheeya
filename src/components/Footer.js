import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full z-40 bg-gradient-to-br from-[#0a0612] via-[#120920] to-[#8B1A5A] text-[#FFF8E7] border-t border-[#FF69B4]/20">
      {/* CONTAINER */}
      <div className="max-w-screen-3xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-2xl font-georgia font-bold text-[#FF69B4] mb-4">
              Follow Us
            </h3>
            <p className="text-xl opacity-90 leading-relaxed">
              Stay connected — join our community on social media.
            </p>

            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center hover:bg-[#FF69B4]/20 hover-lift transition-all duration-300 text-[#FF69B4] hover:text-[#FFF8E7]"
              >
                <FaFacebookF className="text-xl" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center hover:bg-[#FF69B4]/20 hover-lift transition-all duration-300 text-[#FF69B4] hover:text-[#FFF8E7]"
              >
                <FaInstagram className="text-xl" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center hover:bg-[#FF69B4]/20 hover-lift transition-all duration-300 text-[#FF69B4] hover:text-[#FFF8E7]"
              >
                <FaTwitter className="text-xl" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center hover:bg-[#FF69B4]/20 hover-lift transition-all duration-300 text-[#FF69B4] hover:text-[#FFF8E7]"
              >
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-georgia font-bold text-[#FF69B4] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4 text-center">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/programs", label: "Programs" },
                { href: "/gallery", label: "Gallery" },
                { href: "/donate", label: "Donate" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className="w-50 block py-2 px-4 rounded-xl glass-effect hover:bg-[#FF69B4]/20 hover:text-[#FF69B4] hover-lift transition-all duration-300 text-l font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="lg:col-span-1 md:col-span-1">
            <h3 className="text-2xl font-georgia font-bold text-[#FF69B4] mb-6">
              About Us
            </h3>
            <div className="space-y-3 text-xl text-left">
              <p className="glass-effect p-4 rounded-4xl opacity-90 leading-relaxed">
                The Bharatheeya Seva Welfare Society is a registered charitable organization dedicated to empowering communities through education, healthcare, and social welfare programs across Andhra Pradesh.
              </p>
              <p className="text-xs opacity-75 italic">
                Registered under AP Societies Registration Act, 2001
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-2xl font-georgia font-bold text-[#FF69B4] mb-6">
              Our Location
            </h3>

            <div className="glass-card mb-6 overflow-hidden hover-lift">
              <iframe
                width="100%"
                height="180"
                className="block rounded-2xl"
                loading="lazy"
                title="The Bharatheeya Seva Welfare Society Location"
                src="https://www.google.com/maps?q=12-128,+OPP+GOVT+HOSPITAL,+ADDANKI,+Bapatla,+Andhra+Pradesh,+523201&output=embed"
              />
            </div>

            <address className="glass-effect text-justify p-4 rounded-2xl text-md leading-relaxed not-italic opacity-90">
              12-128, Opp Govt Hospital<br/>
              Rev Ward No 14, Addanki<br/>
              Bapatla District, Andhra Pradesh<br/>
              PIN: 523201
            </address>
          </div>
        </div>

        {/* bottom row: divider + copyright */}
        <div className="mt-12 pt-1 divider-ornate mx-auto max-w-md">
          <p className="text-center pt-9 text-sm opacity-75 font-medium px-4">
            © {year} The Bharatheeya Seva Welfare Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
