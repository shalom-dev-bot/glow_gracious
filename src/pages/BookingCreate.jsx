import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function BookingCreate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events/events/");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings/bookings/", {
        event_id: eventId,
        client_id: user.id,
        amount_paid: amountPaid,
      });
      navigate("/bookings");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== "client")
    return <div className="text-white p-6">Access Denied</div>;

  return (
    <div className="min-h-screen bg-darkBlue flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-darkBlue p-8 rounded shadow-md w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-gold mb-6">Create Booking</h1>

        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white"
          required
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} - {event.date}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount Paid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-darkBlue border border-gold text-white"
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-gold text-darkBlue font-bold rounded hover:bg-yellow-500 transition"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}
