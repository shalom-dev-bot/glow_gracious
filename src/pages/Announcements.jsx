import { useState, useEffect } from "react";
import API from "../api/axios";
import { FaPlay, FaCalendarAlt, FaBullhorn } from "react-icons/fa";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await API.get("/announcements/announcements/");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Annonces & Actualités</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Restez informé des dernières nouvelles et annonces de Grace Events
          </p>
        </div>

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaBullhorn className="text-zinc-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucune annonce</h3>
            <p className="text-zinc-400">
              Aucune annonce n'est disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="card hover:border-yellow-500 transition-colors">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Video Section */}
                  {announcement.video_url && (
                    <div className="lg:w-1/3">
                      <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                        <iframe
                          src={announcement.video_url}
                          title={announcement.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center opacity-80">
                            <FaPlay className="text-zinc-950 text-xl ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="lg:flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {announcement.title}
                      </h2>
                      <div className="flex items-center text-zinc-400 text-sm">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(announcement.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-zinc-400 leading-relaxed text-lg">
                        {announcement.description}
                      </p>
                    </div>

                    {announcement.video_url && (
                      <div className="mt-6">
                        <a
                          href={announcement.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                        >
                          <FaPlay className="mr-2" />
                          Regarder la vidéo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Restez informé !
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Inscrivez-vous à notre newsletter pour recevoir les dernières annonces et actualités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="input-field flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


