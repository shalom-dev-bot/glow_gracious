import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCalendarAlt, FaMapMarkerAlt, FaFileImage, FaSave, FaArrowLeft } from "react-icons/fa";

export default function EventCreate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    event_type: "classic",
    package_id: ""
  });
  const [images, setImages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("date", formData.date);
    submitData.append("location", formData.location);
    submitData.append("event_type", formData.event_type);
    if (formData.package_id) submitData.append("package_id", formData.package_id);
    if (images) submitData.append("images", images);

    try {
      await API.post("/events/events/", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/events");
    } catch (err) {
      setError("Erreur lors de la création de l'événement. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "agency")) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-zinc-400">Vous n'avez pas les permissions nécessaires pour créer un événement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center text-zinc-400 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-white">Créer un Événement</h1>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Titre de l'événement</label>
              <input
                type="text"
                name="title"
                placeholder="Ex: Mariage de Marie et Jean"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Décrivez votre événement..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Lieu</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Adresse de l'événement"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Type d'événement</label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="classic">Classique</option>
                  <option value="modern">Moderne</option>
          <option value="vip">VIP</option>
        </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">ID du package (optionnel)</label>
                <input
                  type="number"
                  name="package_id"
                  placeholder="Numéro du package"
                  value={formData.package_id}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Images</label>
              <div className="relative">
                <FaFileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input
                  type="file"
                  onChange={(e) => setImages(e.target.files[0])}
                  className="input-field pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-500 file:text-zinc-950 hover:file:bg-yellow-400"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaSave className="mr-2" />
                {isLoading ? "Création..." : "Créer l'événement"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/events")}
                className="px-6 py-3 border border-zinc-700 text-white rounded-lg hover:border-zinc-600 transition-colors"
              >
                Annuler
              </button>
            </div>
      </form>
        </div>
      </div>
    </div>
  );
}
