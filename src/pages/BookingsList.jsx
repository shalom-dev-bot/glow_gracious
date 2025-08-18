import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/bookings/");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-darkBlue p-6">
      <h1 className="text-3xl font-bold text-gold mb-6">Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-darkBlue rounded shadow hover:shadow-lg transition p-4">
            <h2 className="text-xl font-semibold text-white">{booking.event.title}</h2>
            <p className="text-white">Client: {booking.client.username}</p>
            <p className="text-white">Status: {booking.status}</p>
            <p className="text-gold">Paid: ${booking.amount_paid || 0}</p>
            <p className="text-white">Booking Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {user?.role === "client" && (
        <Link
          to="/bookings/create"
          className="fixed bottom-6 right-6 bg-gold text-darkBlue p-4 rounded-full shadow-lg hover:bg-yellow-500 transition"
        >
          + New Booking
        </Link>
      )}
    </div>
  );
}
