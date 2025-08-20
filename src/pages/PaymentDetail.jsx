import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaArrowLeft, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEuroSign, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaDownload, FaPrint } from "react-icons/fa";

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const response = await API.get(`/payments/payments/${id}/`);
      setPayment(response.data);
    } catch (err) {
      setError("Erreur lors du chargement du paiement");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'processing': return 'text-blue-800 bg-blue-800/10 border-blue-800/20';
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

  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement du paiement...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
          <p className="text-zinc-400 mb-4">{error || "Paiement non trouvé"}</p>
          <button
            onClick={() => navigate("/payments")}
            className="btn-primary"
          >
            Retour aux paiements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/payments")}
              className="flex items-center text-zinc-400 hover:text-white mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Retour
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Paiement #{payment.id}</h1>
              <p className="text-zinc-400">Détails de la transaction</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-blue-outline">
              <FaDownload className="mr-2" />
              Télécharger
            </button>
            <button className="btn-blue-outline">
              <FaPrint className="mr-2" />
              Imprimer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut du paiement */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Statut du paiement</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-2">{getStatusText(payment.status)}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-zinc-400 text-sm">Montant</p>
                  <p className="text-2xl font-bold text-white">{payment.amount} {payment.currency}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Méthode de paiement</p>
                  <p className="text-white font-medium">{getPaymentMethodText(payment.payment_method)}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Date de création</p>
                  <p className="text-white">{formatDate(payment.created_at)}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Date de paiement</p>
                  <p className="text-white">{payment.paid_at ? formatDate(payment.paid_at) : "Non payé"}</p>
                </div>
              </div>

              {payment.transaction_id && (
                <div className="mt-6 p-4 bg-blue-800/10 border border-blue-800/20 rounded-lg">
                  <p className="text-zinc-400 text-sm">ID de transaction</p>
                  <p className="text-blue-800 font-mono">{payment.transaction_id}</p>
                </div>
              )}
            </div>

            {/* Informations de facturation */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Informations de facturation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <FaUser className="text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Nom</span>
                  </div>
                  <p className="text-white">{payment.billing_name || "Non spécifié"}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Email</span>
                  </div>
                  <p className="text-white">{payment.billing_email || "Non spécifié"}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <FaPhone className="text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Téléphone</span>
                  </div>
                  <p className="text-white">{payment.billing_phone || "Non spécifié"}</p>
                </div>
              </div>
            </div>

            {/* Informations de la réservation */}
            {payment.booking && (
              <div className="card">
                <h2 className="text-xl font-bold text-white mb-6">Réservation associée</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-zinc-400 mr-2" />
                      <span className="text-zinc-400 text-sm">Événement</span>
                    </div>
                    <p className="text-white font-medium">{payment.booking.event.title}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-zinc-400 text-sm">Date de l'événement</p>
                      <p className="text-white">{formatDate(payment.booking.event.date)}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm">Lieu</p>
                      <p className="text-white">{payment.booking.event.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-zinc-400 text-sm">Statut de la réservation</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      payment.booking.status === 'confirmed' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                      payment.booking.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                      'text-red-400 bg-red-500/10 border-red-500/20'
                    }`}>
                      {payment.booking.status === 'confirmed' ? 'Confirmée' :
                       payment.booking.status === 'pending' ? 'En attente' : 'Annulée'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {payment.description && (
              <div className="card">
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <p className="text-zinc-300">{payment.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  <FaCreditCard className="mr-2" />
                  Nouveau paiement
                </button>
                <button className="w-full btn-blue-outline">
                  <FaDownload className="mr-2" />
                  Télécharger reçu
                </button>
              </div>
            </div>

            {/* Informations client */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Client</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-zinc-400 text-sm">Nom</p>
                  <p className="text-white">{payment.client.username}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <p className="text-white">{payment.client.email}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Rôle</p>
                  <p className="text-white capitalize">{payment.client.role || 'client'}</p>
                </div>
              </div>
            </div>

            {/* Historique */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Historique</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Créé le</span>
                  <span className="text-white text-sm">{formatDate(payment.created_at)}</span>
                </div>
                {payment.updated_at && payment.updated_at !== payment.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Modifié le</span>
                    <span className="text-white text-sm">{formatDate(payment.updated_at)}</span>
                  </div>
                )}
                {payment.paid_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Payé le</span>
                    <span className="text-white text-sm">{formatDate(payment.paid_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 