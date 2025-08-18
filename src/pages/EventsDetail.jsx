import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await API.get(`/events/events/${id}/`);
      setEvent(response.data);
    } catch (error) {
      setError("Erreur lors du chargement de l'événement");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "classic": return "bg-yellow-500 text-zinc-950";
      case "modern": return "bg-blue-500 text-white";
      case "vip": return "bg-purple-500 text-white";
      default: return "bg-zinc-600 text-white";
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case "classic": return "Classique";
      case "modern": return "Moderne";
      case "vip": return "VIP";
      default: return type;
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
          <p className="text-zinc-400 mb-6">{error || "Événement non trouvé"}</p>
          <Link to="/events" className="btn-primary">
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center text-zinc-400 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.images && (
              <div className="card p-0 overflow-hidden mb-6">
                <img
                  src={event.images}
                  alt={event.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Détails de l'événement</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.event_type)}`}>
                  {getEventTypeLabel(event.event_type)}
                </span>
              </div>

              <div className="space-y-4 mb-6">
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
                  <FaMapMarkerAlt className="mr-3 text-yellow-500" />
                  <span className="font-medium">Lieu:</span>
                  <span className="ml-2">{event.location}</span>
                </div>

                {event.client && (
                  <div className="flex items-center text-zinc-400">
                    <FaUser className="mr-3 text-yellow-500" />
                    <span className="font-medium">Organisateur:</span>
                    <span className="ml-2">{event.client.username || event.client.email}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                <p className="text-zinc-400 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Event Info Card */}
            <div className="card mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Statut:</span>
                  <span className="text-white font-medium capitalize">{event.status}</span>
                </div>
                {event.total_price && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Prix:</span>
                    <span className="text-yellow-500 font-bold">{event.total_price} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Créé le:</span>
                  <span className="text-white">{new Date(event.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/bookings/create?event=${event.id}`}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  Réserver cet événement
                </Link>
                
                <button className="w-full btn-secondary flex items-center justify-center">
                  <FaEdit className="mr-2" />
                  Modifier
                </button>
                
                <button className="w-full px-4 py-3 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center">
                  <FaTrash className="mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
