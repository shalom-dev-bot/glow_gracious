import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { FaCalendarAlt, FaUsers, FaEuroSign, FaChartLine, FaPlus, FaEye } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch events
      const eventsResponse = await API.get("/events/events/");
      const events = eventsResponse.data;
      
      // Fetch bookings
      const bookingsResponse = await API.get("/bookings/bookings/");
      const bookings = bookingsResponse.data;

      // Calculate stats
      const totalEvents = events.length;
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
      const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;

      setStats({ totalEvents, totalBookings, totalRevenue, upcomingEvents });
      setRecentEvents(events.slice(0, 5)); // Get 5 most recent events
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement du dashboard...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
            <p className="text-zinc-400">Bienvenue, {user?.email}</p>
          </div>
          <Link to="/events/create" className="btn-primary mt-4 md:mt-0 flex items-center">
            <FaPlus className="mr-2" />
            Nouvel événement
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Événements</p>
                <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-yellow-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Réservations</p>
                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-800/20 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-800 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Revenus</p>
                <p className="text-3xl font-bold text-white">{stats.totalRevenue.toLocaleString()} €</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FaEuroSign className="text-green-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Événements à venir</p>
                <p className="text-3xl font-bold text-white">{stats.upcomingEvents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Événements récents</h2>
              <Link to="/events" className="text-yellow-500 hover:text-yellow-400 text-sm">
                Voir tout
              </Link>
            </div>
            
            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendarAlt className="text-zinc-600 text-4xl mx-auto mb-4" />
                <p className="text-zinc-400">Aucun événement récent</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{event.title}</h3>
                      <p className="text-zinc-400 text-sm">
                        {new Date(event.date).toLocaleDateString('fr-FR')} • {event.location}
                      </p>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      <FaEye />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Actions rapides</h2>
            <div className="space-y-4">
              <Link
                to="/events/create"
                className="flex items-center p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                  <FaPlus className="text-zinc-950" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Créer un événement</h3>
                  <p className="text-zinc-400 text-sm">Ajouter un nouvel événement</p>
                </div>
              </Link>

              <Link
                to="/bookings"
                className="flex items-center p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Gérer les réservations</h3>
                  <p className="text-zinc-400 text-sm">Voir toutes les réservations</p>
                </div>
              </Link>

              <Link
                to="/events"
                className="flex items-center p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <FaCalendarAlt className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Voir tous les événements</h3>
                  <p className="text-zinc-400 text-sm">Parcourir la liste complète</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



