import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FaUsers, FaCalendarAlt, FaCreditCard, FaStar, FaBullhorn, FaGift, FaChartLine, FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'agency')) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [
        eventsResponse,
        testimonialsResponse,
        paymentsResponse
      ] = await Promise.all([
        API.get("/events/events/"),
        API.get("/testimonials/testimonials/pending/"),
        API.get("/payments/payments/")
      ]);

      setRecentEvents(eventsResponse.data.slice(0, 5));
      setPendingTestimonials(testimonialsResponse.data.slice(0, 5));
      setRecentPayments(paymentsResponse.data.slice(0, 5));

      // Calculer les statistiques
      const totalEvents = eventsResponse.data.length;
      const totalTestimonials = testimonialsResponse.data.length;
      const totalPayments = paymentsResponse.data.length;
      const totalRevenue = paymentsResponse.data
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      setStats({
        totalEvents,
        totalTestimonials,
        totalPayments,
        totalRevenue: totalRevenue.toFixed(2)
      });

    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await API.post(`/testimonials/testimonials/${id}/approve/`);
      fetchDashboardData();
    } catch (err) {
      setError("Erreur lors de l'approbation");
      console.error(err);
    }
  };

  const handleRejectTestimonial = async (id) => {
    try {
      await API.post(`/testimonials/testimonials/${id}/reject/`);
      fetchDashboardData();
    } catch (err) {
      setError("Erreur lors du rejet");
      console.error(err);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'agency')) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-zinc-400">Vous n'avez pas les permissions d'administrateur.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrateur</h1>
          <p className="text-zinc-400">Bienvenue, {user.username} ! Gérez votre plateforme d'événements.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Événements</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Témoignages</p>
                <p className="text-2xl font-bold text-white">{stats.totalTestimonials || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <FaStar className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Paiements</p>
                <p className="text-2xl font-bold text-white">{stats.totalPayments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <FaCreditCard className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Revenus Totaux</p>
                <p className="text-2xl font-bold text-white">{stats.totalRevenue || 0} €</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/events/create" className="card hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-blue-400 text-xl" />
              <div>
                <p className="text-white font-medium">Créer Événement</p>
                <p className="text-zinc-400 text-sm">Ajouter un nouvel événement</p>
              </div>
            </div>
          </Link>

          <Link to="/testimonials" className="card hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaStar className="text-yellow-400 text-xl" />
              <div>
                <p className="text-white font-medium">Gérer Témoignages</p>
                <p className="text-zinc-400 text-sm">Approuver/rejeter les avis</p>
              </div>
            </div>
          </Link>

          <Link to="/payments" className="card hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaCreditCard className="text-green-400 text-xl" />
              <div>
                <p className="text-white font-medium">Paiements</p>
                <p className="text-zinc-400 text-sm">Gérer les transactions</p>
              </div>
            </div>
          </Link>

          <Link to="/users" className="card hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaUsers className="text-purple-400 text-xl" />
              <div>
                <p className="text-white font-medium">Utilisateurs</p>
                <p className="text-zinc-400 text-sm">Gérer les comptes</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Événements Récents</h2>
              <Link to="/events" className="text-blue-400 hover:text-blue-300 text-sm">
                Voir tout
              </Link>
            </div>
            
            {recentEvents.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">Aucun événement récent</p>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-zinc-400 text-sm">{event.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/events/${event.id}`} className="text-blue-400 hover:text-blue-300">
                        <FaEye />
                      </Link>
                      <Link to={`/events/${event.id}/edit`} className="text-yellow-400 hover:text-yellow-300">
                        <FaEdit />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Testimonials */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Témoignages en Attente</h2>
              <Link to="/testimonials" className="text-blue-400 hover:text-blue-300 text-sm">
                Voir tout
              </Link>
            </div>
            
            {pendingTestimonials.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">Aucun témoignage en attente</p>
            ) : (
              <div className="space-y-4">
                {pendingTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">{testimonial.title}</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveTestimonial(testimonial.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleRejectTestimonial(testimonial.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm mb-2">{testimonial.content.substring(0, 100)}...</p>
                    <p className="text-zinc-400 text-xs">Par {testimonial.client.username}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Paiements Récents</h2>
            <Link to="/payments" className="text-blue-400 hover:text-blue-300 text-sm">
              Voir tout
            </Link>
          </div>
          
          {recentPayments.length === 0 ? (
            <p className="text-zinc-400 text-center py-4">Aucun paiement récent</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Montant</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-zinc-800">
                      <td className="py-3 px-4">
                        <span className="text-blue-400 font-mono">#{payment.id}</span>
                      </td>
                      <td className="py-3 px-4 text-white">{payment.client.username}</td>
                      <td className="py-3 px-4 text-white font-bold">{payment.amount} {payment.currency}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{payment.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 