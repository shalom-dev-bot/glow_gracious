import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaStar, FaEuroSign, FaEye, FaSearch, FaGift } from "react-icons/fa";

export default function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await API.get("/packages/packages/");
      setPackages(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || pkg.service_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getPackageTypeColor = (type) => {
    switch (type) {
      case "classic": return "bg-yellow-500 text-zinc-950";
      case "modern": return "bg-blue-500 text-white";
      case "vip": return "bg-purple-500 text-white";
      default: return "bg-zinc-600 text-white";
    }
  };

  const getPackageTypeLabel = (type) => {
    switch (type) {
      case "classic": return "Classique";
      case "modern": return "Moderne";
      case "vip": return "VIP";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement des packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Nos Packages</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Découvrez nos packages personnalisés pour tous types d'événements. 
            Choisissez celui qui correspond le mieux à vos besoins.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher un package..."
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

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaGift className="text-zinc-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucun package trouvé</h3>
            <p className="text-zinc-400">
              {searchTerm || filterType !== "all" 
                ? "Aucun package ne correspond à vos critères de recherche."
                : "Aucun package n'est disponible pour le moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="card group hover:border-yellow-500 transition-colors">
                {pkg.image && (
                  <div className="w-full h-48 bg-zinc-800 rounded-lg mb-6 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                    {pkg.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPackageTypeColor(pkg.service_type)}`}>
                    {getPackageTypeLabel(pkg.service_type)}
                  </span>
                </div>

                <p className="text-zinc-400 mb-6 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <FaStar className="mr-1" />
                    <FaStar className="mr-1" />
                    <FaStar className="mr-1" />
                    <FaStar />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{pkg.price} €</div>
                    <div className="text-zinc-400 text-sm">Prix du package</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-white font-medium">Services inclus :</h4>
                  {pkg.services && pkg.services.length > 0 ? (
                    <ul className="space-y-2">
                      {pkg.services.slice(0, 3).map((service, index) => (
                        <li key={index} className="flex items-center text-zinc-400">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                          {service.name}
                        </li>
                      ))}
                      {pkg.services.length > 3 && (
                        <li className="text-zinc-500 text-sm">
                          +{pkg.services.length - 3} autres services
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-zinc-500 text-sm">Aucun service spécifié</p>
                  )}
                </div>

                <Link
                  to={`/packages/${pkg.id}`}
                  className="w-full btn-primary flex items-center justify-center"
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


