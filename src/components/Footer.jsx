import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-zinc-950 font-bold text-lg">GGE</span>
              </div>
              <span className="text-white font-bold text-xl">Glow gracious Events</span>
            </div>
            <p className="text-zinc-400 mb-4 max-w-md">
              Votre partenaire de confiance pour des événements inoubliables. 
              Nous créons des expériences exceptionnelles qui marquent les esprits.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4">Nos Services</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Événements Classiques</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Événements Modernes</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Événements VIP</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Planification</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-zinc-400">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-yellow-400" />
                <span>shalomdev316@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-yellow-400" />
                <span>+237 692 91 29 14</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400">
          <p>&copy; 2025 GLOW gracious Events Events. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}



