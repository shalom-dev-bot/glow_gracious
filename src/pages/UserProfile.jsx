import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaCamera, FaSave, FaEdit, FaTimes, FaCheck, FaSpinner, FaUpload } from "react-icons/fa";

export default function UserProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    bio: "",
    date_of_birth: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    language: "fr"
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        postal_code: user.postal_code || "",
        language: user.language || "fr"
      });
      setPreviewImage(user.profile_image);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return null;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profile_image', profileImage);
      
      const response = await API.patch('/core/profile/upload-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data.profile_image;
    } catch (err) {
      console.error('Erreur upload image:', err);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Upload image first if there's a new one
      let imageUrl = null;
      if (profileImage) {
        imageUrl = await uploadProfileImage();
      }

      // Update profile data
      const updateData = { ...formData };
      if (imageUrl) {
        updateData.profile_image = imageUrl;
      }

      const response = await API.patch('/core/profile/update/', updateData);
      
      // Update context
      updateUser(response.data);
      
      setSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
      setProfileImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    setPreviewImage(user.profile_image);
    setFormData({
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      bio: user.bio || "",
      date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : "",
      address: user.address || "",
      city: user.city || "",
      country: user.country || "",
      postal_code: user.postal_code || "",
      language: user.language || "fr"
    });
  };

  const getLanguageName = (code) => {
    const languages = {
      'fr': 'Français',
      'en': 'English',
      'es': 'Español',
      'de': 'Deutsch'
    };
    return languages[code] || code;
  };

  const getRoleName = (role) => {
    const roles = {
      'client': 'Client',
      'admin': 'Administrateur',
      'agency': 'Agence'
    };
    return roles[role] || role;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
            <p className="text-zinc-400">Gérez vos informations personnelles</p>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <FaEdit className="mr-2" />
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="btn-blue-outline"
                >
                  <FaTimes className="mr-2" />
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Sauvegarder
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-blue-800"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-800 flex items-center justify-center border-4 border-blue-800">
                      <FaUser className="text-white text-4xl" />
                    </div>
                  )}
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors">
                      <FaCamera className="text-zinc-950 text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <FaSpinner className="animate-spin text-white text-xl" />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                {user.display_name || user.username}
              </h2>
              <p className="text-blue-800 mb-4">{getRoleName(user.role)}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center text-zinc-400">
                  <FaGlobe className="mr-2" />
                  {getLanguageName(user.language)}
                </div>
                <div className="flex items-center justify-center text-zinc-400">
                  <FaCalendarAlt className="mr-2" />
                  Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-6">Informations Personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Nom d'utilisateur</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field disabled:opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field pl-10 disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Téléphone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field pl-10 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Date de naissance</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-white font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className="input-field resize-none disabled:opacity-50"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-6">Adresse</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Adresse</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="2"
                        className="input-field pl-10 resize-none disabled:opacity-50"
                        placeholder="Votre adresse complète"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Ville</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Pays</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Code postal</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-6">Préférences</h3>
                
                <div>
                  <label className="block text-white font-medium mb-2">Langue</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:opacity-50"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 