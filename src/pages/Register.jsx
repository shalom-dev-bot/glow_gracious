import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const success = await register(form.username, form.email, form.password);
    setMessage(success ? "Registration successful! Check email." : "Error registering.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 mb-3 rounded bg-gray-700"/>
        <input name="email" placeholder="Email" type="email" onChange={handleChange} className="w-full p-2 mb-3 rounded bg-gray-700"/>
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full p-2 mb-3 rounded bg-gray-700"/>
        <button type="submit" className="w-full bg-pink-500 p-2 rounded hover:bg-pink-600 transition">Register</button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </motion.form>
    </div>
  );
}
