import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";

export default function Activate() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Activation de votre compte en cours...");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const res = await API.get(`/core/activate/${token}/`);
        setStatus("success");
        setMessage(res.data.message || "Votre compte a été activé avec succès !");
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Échec de l'activation. Veuillez réessayer.");
      }
    };
    activateAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
            status === "loading" ? "bg-blue-500" : 
            status === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
            {status === "loading" && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            )}
            {status === "success" && <FaCheckCircle className="text-white text-2xl" />}
            {status === "error" && <FaTimesCircle className="text-white text-2xl" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {status === "loading" ? "Activation en cours" :
             status === "success" ? "Compte Activé !" : "Erreur d'Activation"}
          </h1>
          <p className="text-zinc-400">Grace Events</p>
        </div>

        <div className="card text-center">
          <p className="text-white mb-6">{message}</p>
          
          {status === "success" && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center text-green-400 mb-2">
                <FaEnvelope className="mr-2" />
                <span className="font-medium">Redirection automatique...</span>
              </div>
              <p className="text-green-400 text-sm">
                Vous allez être redirigé vers la page de connexion dans quelques secondes.
              </p>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">
                  Si le problème persiste, contactez notre support.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary w-full"
              >
                Aller à la page de connexion
              </button>
            </div>
          )}
          
          {status === "loading" && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                Veuillez patienter pendant que nous activons votre compte...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
