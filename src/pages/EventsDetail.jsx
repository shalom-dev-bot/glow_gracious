import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/events/${id}/`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-darkBlue p-6">
      <h1 className="text-3xl font-bold text-gold mb-4">{event.title}</h1>
      {event.images && (
        <img
          src={event.images}
          alt={event.title}
          className="w-full max-h-96 object-cover mb-4 opacity-80 rounded"
        />
      )}
      <p className="text-white mb-2">{event.date} - {event.status}</p>
      <p className="text-white mb-2">{event.location}</p>
      <p className="text-white mb-2">{event.description}</p>
      <p className="text-gold mb-2">Package: {event.package?.name || "None"}</p>
      <p className="text-white">Client: {event.client.username}</p>
    </div>
  );
}
