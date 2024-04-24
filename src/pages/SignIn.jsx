import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const init = {
  email: "",
  password: "",
};

function SignIn() {
  const [formData, setFormData] = useState({ ...init });
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    dispatch(signInStart());
    const res = await fetch("https://real-estate-server-ezx7.onrender.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }

    dispatch(signInSuccess(data));
    alert("User Logged in Successfully");
    navigate("/");
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have any account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>

      <p className="text-red-600 mt-3">{error && error}</p>
    </div>
  );
}

export default SignIn;
