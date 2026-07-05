import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#how" },
  { label: "Sécurité", href: "#security" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink-950/90 backdrop-blur-xl border-b hairline py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-lg tracking-tight text-paper">
          Finance<span className="text-gradient-brass">Flow</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-sm text-paper-dim hover:text-paper transition-colors duration-200">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-paper-dim hover:text-paper transition-colors duration-200 px-4 py-2">
            Connexion
          </Link>
          <Link to="/register" className="text-sm font-medium bg-brass text-ink-950 px-5 py-2.5 rounded-lg hover:bg-brass/90 transition-all duration-200">
            Commencer gratuitement
          </Link>
        </div>

        <button className="md:hidden p-2 text-paper" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-ink-900 border-t hairline px-6 py-4 flex flex-col gap-4 animate-rise">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-paper-dim hover:text-paper transition-colors" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="border-t hairline pt-4 flex flex-col gap-3">
            <Link to="/login" className="text-sm text-center text-paper-dim hover:text-paper transition-colors">Connexion</Link>
            <Link to="/register" className="text-sm font-medium text-center bg-brass text-ink-950 px-5 py-2.5 rounded-lg">Commencer gratuitement</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
