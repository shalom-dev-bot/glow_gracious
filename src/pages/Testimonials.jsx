import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FaStar, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaSpinner, FaHeart } from "react-icons/fa";

export default function Testimonials() {
  const { user } = useContext(AuthContext);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    event_type: "",
    event_date: "",
    location: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const [publicResponse, featuredResponse] = await Promise.all([
        API.get("/testimonials/testimonials/public/"),
        API.get("/testimonials/testimonials/featured/")
      ]);
      
      setTestimonials(publicResponse.data);
      setFeaturedTestimonials(featuredResponse.data);
    } catch (err) {
      setError("Erreur lors du chargement des témoignages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/testimonials/testimonials/", formData);
      setFormData({
        title: "",
        content: "",
        rating: 5,
        event_type: "",
        event_date: "",
        location: ""
      });
      setShowCreateForm(false);
      fetchTestimonials();
    } catch (err) {
      setError("Erreur lors de la sauvegarde du témoignage");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-zinc-600'}`}
      />
    ));
  };

  const TestimonialCard = ({ testimonial, isFeatured = false }) => (
    <div className={`card ${isFeatured ? 'border-yellow-500/50 bg-yellow-500/5' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-xl" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{testimonial.title}</h3>
            {isFeatured && <FaHeart className="text-yellow-500 text-xl" />}
          </div>
          
          <p className="text-zinc-300 mb-3 leading-relaxed">{testimonial.content}</p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center mr-3">
              {renderStars(testimonial.rating)}
            </div>
            <span className="text-zinc-400 text-sm">{testimonial.rating}/5</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{testimonial.client.username}</p>
              <p className="text-zinc-400 text-sm">{testimonial.created_at}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement des témoignages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Témoignages</h1>
            <p className="text-zinc-400">Découvrez ce que nos clients disent de nous</p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary mt-4 md:mt-0"
            >
              <FaPlus className="mr-2" />
              Ajouter un témoignage
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {featuredTestimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaHeart className="text-yellow-500 mr-3" />
              Témoignages mis en avant
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} isFeatured={true} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Tous les témoignages</h2>
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="text-zinc-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucun témoignage</h3>
              <p className="text-zinc-400">Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Nouveau témoignage</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Contenu</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Note</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-2xl ${star <= formData.rating ? 'text-yellow-500' : 'text-zinc-600'}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="text-white ml-2">{formData.rating}/5</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaCheck className="mr-2" />
                    )}
                    Publier
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-zinc-700 text-white rounded-lg hover:border-zinc-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
