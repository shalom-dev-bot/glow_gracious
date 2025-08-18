import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(username, email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-darkBlue">
      <form 
        onSubmit={handleSubmit} 
        className="bg-darkBlue p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-gold mb-6">Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-darkBlue border border-gold text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-darkBlue border border-gold text-white"
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-gold text-darkBlue font-bold rounded hover:bg-yellow-500 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
