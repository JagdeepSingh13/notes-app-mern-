import React from "react";
import Navbar from "../../components/navbar/Navbar";
import PasswordInput from "../../components/input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email is required in correct format");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError(null);

    // Implement the signup API call here
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

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
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Signup</h4>
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-transparent border-b-2 border-gray-400 mb-4 py-1 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="E-mail"
              className="w-full bg-transparent border-b-2 border-gray-400 mb-4 py-1 outline-none"
              value={email}
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
              Create Account
            </button>
            <p className="text-sm text-center mb-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 underline">
                Login now!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
