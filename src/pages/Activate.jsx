import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function Activate() {
  const { token } = useParams();
  const [message, setMessage] = useState("Activating account...");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const res = await API.get(`/core/activate/${token}/`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.error || "Activation failed");
      }
    };
    activateAccount();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-darkBlue">
      <div className="bg-darkBlue p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gold mb-6">Account Activation</h1>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}
