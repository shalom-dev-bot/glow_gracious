import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaUser, FaComments } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contactez-nous</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Nous sommes là pour vous aider à créer des événements inoubliables. 
            N'hésitez pas à nous contacter pour toute question ou demande.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Nom complet</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Sujet de votre message"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <div className="relative">
                  <FaComments className="absolute left-3 top-3 text-zinc-400" />
                  <textarea
                    name="message"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="input-field pl-10 resize-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" />
                {isLoading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Informations de contact</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-zinc-950" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-zinc-400">shalomdev316@gmail.com</p>
                    <p className="text-zinc-400 text-sm">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Téléphone</h3>
                    <p className="text-zinc-400">+237 692912914</p>
                    <p className="text-zinc-400 text-sm">Lun-Ven: 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Adresse</h3>
                    <p className="text-zinc-400">socada</p>
                    <p className="text-zinc-400">bafoussam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h2>
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-white font-medium mb-2">Comment réserver un événement ?</h3>
                  <p className="text-zinc-400 text-sm">
                    Parcourez nos événements disponibles et cliquez sur "Réserver" pour commencer le processus.
                  </p>
                </div>
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-white font-medium mb-2">Quels sont les délais de réservation ?</h3>
                  <p className="text-zinc-400 text-sm">
                    Nous recommandons de réserver au moins 2 semaines à l'avance pour les événements populaires.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Puis-je annuler ma réservation ?</h3>
                  <p className="text-zinc-400 text-sm">
                    Oui, les annulations sont possibles jusqu'à 48h avant l'événement avec remboursement complet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 