// src/components/Register.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../features/api/apiSlice";
import { setCredentials } from "../features/auth/authSlice";
import log from "../assets/log.png";
import Logo from "../components/Logo1";
import Loader from "../components/Loader";

function Register() {
  // Form state variables
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Role selection state
  const [role, setRole] = useState("user");
  const [roleCode, setRoleCode] = useState("");

  // Visibility toggles for password inputs
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleCode, setShowRoleCode] = useState(false);

  // Hooks for navigation and dispatching actions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing userInfo from Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // RTK Query mutation for user registration
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard/board");
    }
  }, [navigate, userInfo]);

  // Submit handler for the registration form
  const submitHandler = async (e) => {
    e.preventDefault();

    // Password confirmation check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
      };

      // Role code validation for admin and staff roles
      if ((role === "admin" || role === "staff") && !roleCode) {
        toast.error(`Please enter the ${role} code.`);
        return;
      }

      // Include roleCode if applicable
      if (role === "admin" || role === "staff") {
        registrationData.roleCode = roleCode;
      }

      // Call the registerUser mutation
      const res = await registerUser(registrationData).unwrap();
      console.log("Registration response:", res);

      // Check if the response contains token and user data
      if (!res.token || !res.user) {
        console.error("Token or user data is missing in response.");
        toast.error("Registration successful, but unable to log in.");
        return;
      }

      // Combine token and user info
      const userInfoWithToken = {
        ...res.user,
        token: res.token,
      };

      // Store combined userInfo in localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfoWithToken));

      // Update Redux state with user info
      dispatch(setCredentials(userInfoWithToken));

      // Success message and redirect
      toast.success("Registered successfully!");
      navigate("/dashboard/board");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err?.data?.message || err.error || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {/* Left side image */}
      <img src={log} alt="Log" className="h-auto w-[30%]" />

      {/* Registration form */}
      <div className="h-[90%] w-[70%] flex flex-col items-center justify-between">
        {/* Header */}
        <div className="w-[60%] mt-10">
          <div className="flex items-center justify-between w-full">
            <Logo />
            <p className="text-3xl font-bold">Sign Up</p>
          </div>
        </div>

        {/* Registration Form */}
        <form
          className="flex flex-col items-center w-full gap-2"
          style={{ minHeight: "400px" }}
          onSubmit={submitHandler}
        >
          {/* First Name */}
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="w-[60%] h-[35px] outline-none border-2 border-slate-400 text-center rounded-xl"
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            autoComplete="given-name"
            required
          />

          {/* Last Name */}
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="w-[60%] h-[35px] outline-none border-2 border-slate-400 text-center rounded-xl"
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            autoComplete="family-name"
            required
          />

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-[60%] h-[35px] outline-none border-2 border-slate-400 text-center rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-[60%] h-[35px] outline-none border-2 border-slate-400 text-center rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {/* Password Input */}
          <div className="relative w-[60%] h-[35px]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full h-full text-center border-2 outline-none border-slate-400 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <div
              className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
              onClick={() => setShowPassword(!showPassword)}
              style={{ fontSize: "1.5em" }}
            >
              {showPassword ? "🙈" : "👁️"}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="relative w-[60%] h-[35px]">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full h-full text-center border-2 outline-none border-slate-400 rounded-xl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <div
              className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ fontSize: "1.5em" }}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </div>
          </div>

          {/* Role Selection */}
          <div className="w-[60%] flex flex-col mt-4">
            <p className="mb-2 text-xl font-bold">Register as:</p>
            <div className="flex justify-around">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="ml-2">User</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={role === "staff"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="ml-2">Staff</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="ml-2">Admin</span>
              </label>
            </div>
          </div>

          {/* Role Code Input (conditionally rendered) */}
          {(role === "admin" || role === "staff") && (
            <div className="relative w-[60%] h-[35px]">
              <input
                type={showRoleCode ? "text" : "password"}
                name="roleCode"
                placeholder={`Enter ${role} code`}
                className="w-full h-full text-center border-2 outline-none border-slate-400 rounded-xl"
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value)}
                required
              />
              <div
                className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
                onClick={() => setShowRoleCode(!showRoleCode)}
                style={{ fontSize: "1.5em" }}
              >
                {showRoleCode ? "🙈" : "👁️"}
              </div>
            </div>
          )}

          {/* Loader during registration */}
          {isLoading && <Loader />}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-[60%] bg-red-500 h-[35px] text-white flex justify-center items-center font-bold rounded-xl mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Link to Login Page */}
        <p className="text-xl font-bold">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 no-underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
