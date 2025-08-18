import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaStar, FaArrowRight, FaPlay, FaGift, FaBullhorn } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-blue-900/20 to-zinc-800 opacity-90"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Créez des <span className="text-yellow-500">Événements</span> Inoubliables
          </h1>
          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Grace Events vous accompagne dans la création d'expériences exceptionnelles. 
            De la planification à l'exécution, nous rendons vos rêves réalité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn-primary text-lg px-8 py-4">
              Découvrir nos événements
            </Link>
            <button className="btn-blue text-lg px-8 py-4 flex items-center justify-center">
              <FaPlay className="mr-2" />
              Voir la vidéo
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nos Services</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Trois types d'événements pour répondre à tous vos besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Classic Events */}
            <div className="card group hover:border-yellow-500 transition-colors">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaCalendarAlt size={24} className="text-zinc-950" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Événements Classiques</h3>
              <p className="text-zinc-400 mb-6">
                Des événements traditionnels avec une touche d'élégance. 
                Parfaits pour les mariages, anniversaires et célébrations familiales.
              </p>
              <Link to="/events" className="text-yellow-500 hover:text-yellow-400 flex items-center">
                En savoir plus <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Modern Events */}
            <div className="card-blue group hover:border-blue-500 transition-colors">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaUsers size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Événements Modernes</h3>
              <p className="text-zinc-400 mb-6">
                Des événements contemporains avec des technologies innovantes. 
                Idéaux pour les lancements de produits et événements d'entreprise.
              </p>
              <Link to="/events" className="text-blue-400 hover:text-blue-300 flex items-center">
                En savoir plus <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* VIP Events */}
            <div className="card group hover:border-yellow-500 transition-colors">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaStar size={24} className="text-zinc-950" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Événements VIP</h3>
              <p className="text-zinc-400 mb-6">
                Des événements exclusifs et luxueux. 
                Service premium pour des occasions spéciales et des clients exigeants.
              </p>
              <Link to="/events" className="text-yellow-500 hover:text-yellow-400 flex items-center">
                En savoir plus <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Pourquoi Choisir Grace Events ?</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Découvrez ce qui nous rend uniques
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaGift className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Packages Personnalisés</h3>
              <p className="text-zinc-400">Des forfaits adaptés à tous les budgets et besoins</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-zinc-950 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Planification Complète</h3>
              <p className="text-zinc-400">De la conception à l'exécution, nous gérons tout</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaBullhorn className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Communication Transparente</h3>
              <p className="text-zinc-400">Suivi en temps réel de votre événement</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-zinc-950 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Excellence Garantie</h3>
              <p className="text-zinc-400">Plus de 500 événements réussis à notre actif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">500+</div>
              <div className="text-zinc-400">Événements Réalisés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">1000+</div>
              <div className="text-zinc-400">Clients Satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">50+</div>
              <div className="text-zinc-400">Partenaires</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">5</div>
              <div className="text-zinc-400">Années d'Expérience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-zinc-900 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à créer votre événement de rêve ?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Contactez-nous dès aujourd'hui pour commencer à planifier votre événement inoubliable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events/create" className="btn-primary text-lg px-8 py-4">
              Créer un événement
            </Link>
            <Link to="/contact" className="btn-blue text-lg px-8 py-4">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
