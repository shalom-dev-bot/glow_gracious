import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { FaCalendarAlt, FaEuroSign, FaArrowLeft, FaSave, FaCreditCard } from "react-icons/fa";

export default function BookingCreate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event");

  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    amount_paid: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    } else {
      setLoading(false);
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await API.get(`/events/events/${eventId}/`);
      setEvent(response.data);
    } catch (error) {
      setError("Erreur lors du chargement de l'événement");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
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
    setIsSubmitting(true);

    try {
      const bookingData = {
        event: eventId,
        client: user.id,
        amount_paid: formData.amount_paid || null
      };

      await API.post("/bookings/bookings/", bookingData);
      navigate("/bookings");
    } catch (error) {
      setError("Erreur lors de la création de la réservation. Veuillez réessayer.");
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (!eventId || !event) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Événement non trouvé</h1>
          <p className="text-zinc-400 mb-6">L'événement que vous recherchez n'existe pas.</p>
          <button
            onClick={() => navigate("/events")}
            className="btn-primary"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-zinc-400 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-white">Réserver un événement</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Détails de l'événement</h2>
            
            {event.images && (
              <div className="w-full h-48 bg-zinc-800 rounded-lg mb-4 overflow-hidden">
                <img
                  src={event.images}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-zinc-400">{event.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-zinc-400">
                  <FaCalendarAlt className="mr-3 text-yellow-500" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center text-zinc-400">
                  <FaEuroSign className="mr-3 text-yellow-500" />
                  <span className="font-medium">Prix:</span>
                  <span className="ml-2">{event.total_price ? `${event.total_price} €` : "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Informations de réservation</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Client</label>
                <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <p className="text-white">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Montant payé (optionnel)</label>
                <div className="relative">
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <input
          type="number"
                    name="amount_paid"
                    placeholder="0.00"
                    value={formData.amount_paid}
                    onChange={handleChange}
                    className="input-field pl-10"
                    step="0.01"
                    min="0"
                  />
                </div>
                <p className="text-zinc-400 text-sm mt-1">
                  Laissez vide si le paiement sera effectué plus tard
                </p>
              </div>

              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Événement:</span>
                    <span className="text-white">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Date:</span>
                    <span className="text-white">{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Prix de l'événement:</span>
                    <span className="text-white">{event.total_price ? `${event.total_price} €` : "Non spécifié"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Montant payé:</span>
                    <span className="text-white">{formData.amount_paid ? `${formData.amount_paid} €` : "À définir"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
        <button
          type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? "Réservation..." : "Confirmer la réservation"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-zinc-700 text-white rounded-lg hover:border-zinc-600 transition-colors"
                >
                  Annuler
        </button>
              </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  );
}
