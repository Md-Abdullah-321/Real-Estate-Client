import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const init = {
  username: "",
  email: "",
  password: "",
};

function SignUp() {
  const [formData, setFormData] = useState({ ...init });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      alert("Please, fill all the filed");
      return;
    }

    setLoading(true);
    const res = await fetch("https://real-estate-server-ezx7.onrender.com/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    }

    setError("");
    alert("User Created Successfully");
    navigate("/sign-in");
    setLoading(false);
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="username"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>

      <p className="text-red-600 mt-3">{error && error}</p>
    </div>
  );
}

export default SignUp;
