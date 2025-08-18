import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FaCreditCard, FaSearch, FaFilter, FaEye, FaDownload, FaChartBar, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function PaymentList() {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await API.get("/payments/payments/");
      setPayments(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des paiements");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get("/payments/payments/payment_stats/");
      setStats(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'cancelled': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'processing': return <FaExclamationTriangle />;
      case 'failed': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Complété';
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'failed': return 'Échoué';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.booking?.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement des paiements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Paiements</h1>
            <p className="text-zinc-400">Gérez tous vos paiements et transactions</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/payments/create" className="btn-primary">
              <FaCreditCard className="mr-2" />
              Nouveau Paiement
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Paiements</p>
                <p className="text-2xl font-bold text-white">{stats.total_payments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaCreditCard className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Montant Total</p>
                <p className="text-2xl font-bold text-white">{stats.total_amount || 0} €</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-white">{stats.pending_payments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <FaClock className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Complétés</p>
                <p className="text-2xl font-bold text-white">{stats.completed_payments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Rechercher par événement, client ou ID transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-zinc-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En cours</option>
                  <option value="completed">Complétés</option>
                  <option value="failed">Échoués</option>
                  <option value="cancelled">Annulés</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <FaCreditCard className="text-zinc-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucun paiement trouvé</h3>
              <p className="text-zinc-400">Aucun paiement ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">ID</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Événement</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Client</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Montant</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Méthode</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Statut</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Date</th>
                    <th className="text-left py-4 px-4 text-zinc-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                      <td className="py-4 px-4">
                        <span className="text-blue-400 font-mono">#{payment.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{payment.booking?.event?.title}</p>
                          <p className="text-zinc-400 text-sm">{payment.booking?.event?.date}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white">{payment.client?.username}</p>
                          <p className="text-zinc-400 text-sm">{payment.client?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-bold">{payment.amount} {payment.currency}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-zinc-400">{payment.payment_method}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{getStatusText(payment.status)}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-zinc-400">{payment.created_at}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/payments/${payment.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FaEye />
                          </Link>
                        </div>
                      </td>
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