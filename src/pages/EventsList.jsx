import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get("/events/events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || event.event_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getEventTypeColor = (type) => {
    switch (type) {
      case "classic": return "bg-yellow-500 text-zinc-950";
      case "modern": return "bg-blue-800 text-white";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement des événements...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Nos Événements</h1>
            <p className="text-zinc-400">Découvrez nos événements exceptionnels</p>
          </div>
          <Link to="/events/create" className="btn-primary mt-4 md:mt-0 flex items-center">
            <FaPlus className="mr-2" />
            Créer un événement
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">Tous les types</option>
              <option value="classic">Classique</option>
              <option value="modern">Moderne</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-zinc-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucun événement trouvé</h3>
            <p className="text-zinc-400">
              {searchTerm || filterType !== "all" 
                ? "Aucun événement ne correspond à vos critères de recherche."
                : "Aucun événement n'est disponible pour le moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="card group hover:border-yellow-500 transition-colors">
                {event.images && (
                  <div className="w-full h-48 bg-zinc-800 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={event.images}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                    {event.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                    {getEventTypeLabel(event.event_type)}
                  </span>
                </div>

                <p className="text-zinc-400 mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-zinc-400">
                    <FaCalendarAlt className="mr-2 text-yellow-500" />
                    <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center text-zinc-400">
                    <FaMapMarkerAlt className="mr-2 text-yellow-500" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="btn-secondary w-full flex items-center justify-center"
                >
                  <FaEye className="mr-2" />
                  Voir les détails
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



