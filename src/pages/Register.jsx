import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      setIsSuccess(true);
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Inscription Réussie !</h1>
            <p className="text-zinc-400">Grace Events</p>
          </div>

          <div className="card text-center">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
              <FaEnvelope className="text-green-400 text-3xl mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-3">Vérifiez votre email</h2>
              <p className="text-green-400 mb-4">
                Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
              </p>
              <p className="text-zinc-400 text-sm">
                Cliquez sur le lien dans l'email pour activer votre compte et commencer à utiliser Grace Events.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <h3 className="text-blue-400 font-medium mb-2">Prochaines étapes :</h3>
              <ul className="text-blue-400 text-sm space-y-1 text-left">
                <li>• Vérifiez votre boîte de réception</li>
                <li>• Cliquez sur le lien d'activation</li>
                <li>• Connectez-vous à votre compte</li>
                <li>• Commencez à créer des événements !</li>
              </ul>
            </div>

            <button
              onClick={() => window.location.href = "/login"}
              className="btn-primary w-full"
            >
              Aller à la page de connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-zinc-950 font-bold text-2xl">G</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-zinc-400">Rejoignez Grace Events</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Nom d'utilisateur</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Votre nom d'utilisateur"
                  value={formData.username}
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
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Création du compte..." : "Créer un compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Déjà un compte ?{" "}
              <a href="/login" className="text-yellow-500 hover:text-yellow-400 font-medium">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
