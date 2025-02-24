import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setError(null);

    // Call the login API here
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpexted error occured");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="flex justify-center text-center w-96 p-6 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="E-mail"
              className="w-full bg-transparent border-b-2 border-gray-400 mb-4 py-1 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm text-left">{error}</p>}

            <button
              type="submit"
              className="items-center bg-blue-600 text-white rounded-2xl w-full mt-4 py-1 font-medium mb-2"
            >
              Login
            </button>
            <p className="text-sm text-center mb-4">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 underline"
              >
                Create an account now!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
