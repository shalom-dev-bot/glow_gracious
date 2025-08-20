import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FaCreditCard, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEuroSign, FaLock, FaArrowLeft, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PaymentCreate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { bookingId } = useParams();
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    booking_id: bookingId || "",
    amount: "",
    currency: "EUR",
    payment_method: "card",
    billing_name: "",
    billing_email: "",
    billing_phone: "",
    description: ""
  });

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await API.get(`/bookings/bookings/${bookingId}/`);
      setBooking(response.data);
      setFormData(prev => ({
        ...prev,
        booking_id: bookingId,
        amount: response.data.amount_paid || "",
        description: `Paiement pour l'événement: ${response.data.event.title}`
      }));
    } catch (err) {
      setError("Erreur lors du chargement de la réservation");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await API.post("/payments/payments/", formData);
      const payment = response.data;
      
      // Simuler le traitement du paiement
      setIsProcessing(true);
      
      const processResponse = await API.post(`/payments/payments/${payment.id}/process_payment/`);
      
      if (processResponse.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/payments");
        }, 3000);
      } else {
        setError(processResponse.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du paiement");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card': return <FaCreditCard />;
      case 'mobile_money': return <FaPhone />;
      case 'bank_transfer': return <FaEuroSign />;
      case 'cash': return <FaEuroSign />;
      case 'paypal': return <FaCreditCard />;
      case 'stripe': return <FaCreditCard />;
      default: return <FaCreditCard />;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'mobile_money': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash': return 'Espèces';
      case 'paypal': return 'PayPal';
      case 'stripe': return 'Stripe';
      default: return method;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Paiement Réussi !</h1>
            <p className="text-zinc-400">Grace Events</p>
          </div>

          <div className="card text-center">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
              <FaCreditCard className="text-green-400 text-3xl mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-3">Transaction Complétée</h2>
              <p className="text-green-400 mb-4">
                Votre paiement de <strong>{formData.amount} {formData.currency}</strong> a été traité avec succès.
              </p>
              <p className="text-zinc-400 text-sm">
                Vous allez recevoir un email de confirmation dans quelques instants.
              </p>
            </div>

            <div className="bg-blue-800/10 border border-blue-800/20 rounded-lg p-4 mb-6">
              <h3 className="text-blue-800 font-medium mb-2">Prochaines étapes :</h3>
              <ul className="text-blue-800 text-sm space-y-1 text-left">
                <li>• Vérifiez votre email de confirmation</li>
                <li>• Votre réservation est maintenant confirmée</li>
                <li>• Consultez vos paiements dans votre espace client</li>
              </ul>
            </div>

            <button
              onClick={() => navigate("/payments")}
              className="btn-primary w-full"
            >
              Voir mes paiements
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/payments")}
            className="flex items-center text-zinc-400 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-white">Nouveau Paiement</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de paiement */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Informations de paiement</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de réservation */}
              {booking && (
                <div className="bg-blue-800/10 border border-blue-800/20 rounded-lg p-4 mb-6">
                  <h3 className="text-blue-800 font-medium mb-2">Réservation</h3>
                  <div className="space-y-2">
                    <p className="text-white"><strong>Événement:</strong> {booking.event.title}</p>
                    <p className="text-zinc-400"><strong>Date:</strong> {booking.event.date}</p>
                    <p className="text-zinc-400"><strong>Lieu:</strong> {booking.event.location}</p>
                  </div>
                </div>
              )}

              {/* Montant */}
              <div>
                <label className="block text-white font-medium mb-2">Montant</label>
                <div className="relative">
                  <FaEuroSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="input-field pl-10"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Devise et méthode de paiement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Devise</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Méthode de paiement</label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="card">Carte bancaire</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="cash">Espèces</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
              </div>

              {/* Informations de facturation */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Informations de facturation</h3>
                
                <div>
                  <label className="block text-white font-medium mb-2">Nom complet</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      name="billing_name"
                      placeholder="Votre nom complet"
                      value={formData.billing_name}
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
                      name="billing_email"
                      placeholder="votre@email.com"
                      value={formData.billing_email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Téléphone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      name="billing_phone"
                      placeholder="+33 6 12 34 56 78"
                      value={formData.billing_phone}
                      onChange={handleChange}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description (optionnel)</label>
                <textarea
                  name="description"
                  placeholder="Description du paiement..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                />
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading || isProcessing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Traitement en cours...
                  </>
                ) : isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Création du paiement...
                  </>
                ) : (
                  <>
                    <FaLock className="mr-2" />
                    Procéder au paiement sécurisé
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Résumé et informations */}
          <div className="space-y-6">
            {/* Résumé du paiement */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Résumé du paiement</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Montant</span>
                  <span className="text-white font-bold">{formData.amount || "0.00"} {formData.currency}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Méthode</span>
                  <span className="text-white flex items-center">
                    {getPaymentMethodIcon(formData.payment_method)}
                    <span className="ml-2">{getPaymentMethodText(formData.payment_method)}</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Frais de transaction</span>
                  <span className="text-white">0.00 {formData.currency}</span>
                </div>
                
                <hr className="border-zinc-700" />
                
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-yellow-500 font-bold text-xl">{formData.amount || "0.00"} {formData.currency}</span>
                </div>
              </div>
            </div>

            {/* Informations de sécurité */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Sécurité</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FaLock className="text-green-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Paiement sécurisé</p>
                    <p className="text-zinc-400 text-sm">Vos données sont protégées par un chiffrement SSL</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCreditCard className="text-blue-800 mt-1" />
                  <div>
                    <p className="text-white font-medium">Méthodes de paiement fiables</p>
                    <p className="text-zinc-400 text-sm">Nous acceptons les principales méthodes de paiement</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Confirmation immédiate</p>
                    <p className="text-zinc-400 text-sm">Recevez une confirmation instantanée de votre paiement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 