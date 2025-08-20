import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { FaCalendarAlt, FaUser, FaEuroSign, FaEye, FaPlus, FaSearch, FaClock } from "react-icons/fa";

export default function BookingList() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/bookings/");
      setBookings(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.client?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-500 text-white";
      case "pending": return "bg-yellow-400 text-zinc-950";
      case "canceled": return "bg-red-500 text-white";
      default: return "bg-zinc-600 text-white";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed": return "Confirmée";
      case "pending": return "En attente";
      case "canceled": return "Annulée";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mes Réservations</h1>
            <p className="text-zinc-400">Gérez vos réservations d'événements</p>
          </div>
          <Link to="/events" className="btn-primary mt-4 md:mt-0 flex items-center">
            <FaPlus className="mr-2" />
            Réserver un événement
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher une réservation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="canceled">Annulée</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-zinc-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucune réservation trouvée</h3>
            <p className="text-zinc-400 mb-6">
              {searchTerm || filterStatus !== "all" 
                ? "Aucune réservation ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de réservations."
              }
            </p>
            <Link to="/events" className="btn-primary">
              Découvrir nos événements
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card hover:border-yellow-500 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">
                        {booking.event?.title || "Événement supprimé"}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-zinc-400">
                        <FaUser className="mr-2 text-yellow-400" />
                        <span>Client: {booking.client?.username || booking.client?.email}</span>
                      </div>
                      <div className="flex items-center text-zinc-400">
                        <FaCalendarAlt className="mr-2 text-yellow-400" />
                        <span>Date: {new Date(booking.booking_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {booking.amount_paid && (
                        <div className="flex items-center text-zinc-400">
                          <FaEuroSign className="mr-2 text-yellow-400" />
                          <span>Montant: {booking.amount_paid} €</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    {booking.event && (
                      <Link
                        to={`/events/${booking.event.id}`}
                        className="btn-secondary flex items-center"
                      >
                        <FaEye className="mr-2" />
                        Voir l'événement
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 