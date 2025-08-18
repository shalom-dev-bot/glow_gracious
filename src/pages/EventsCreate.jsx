import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EventCreate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [event_type, setEventType] = useState("classic");
  const [package_id, setPackageId] = useState(null);
  const [images, setImages] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("event_type", event_type);
    formData.append("package_id", package_id);
    if (images) formData.append("images", images);

    try {
      await API.post("/events/events/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/events");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "agency")) return <div className="text-white p-6">Access Denied</div>;

  return (
    <div className="min-h-screen bg-darkBlue p-6 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-darkBlue p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gold mb-6">Create Event</h1>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white" required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white" required />
        <select value={event_type} onChange={(e) => setEventType(e.target.value)} className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white">
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="vip">VIP</option>
        </select>
        <input type="number" placeholder="Package ID" value={package_id} onChange={(e) => setPackageId(e.target.value)} className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white" />
        <input type="file" onChange={(e) => setImages(e.target.files[0])} className="w-full mb-6 text-white" />
        <button type="submit" className="w-full p-3 bg-gold text-darkBlue font-bold rounded hover:bg-yellow-500 transition">Create Event</button>
      </form>
    </div>
  );
}
