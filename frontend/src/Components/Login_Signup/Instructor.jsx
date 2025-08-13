import "./login.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authFunction } from "../../Redux/login/action";
import { Navigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { ColorButton } from "../ProdCard/popperprodcard";

const Instructor = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "instructor",
    subscribe: true,
  });
  const { user, loading, error } = useSelector((store) => store.auth);
  console.log("user", user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // already logged in user, can't became a teacher.
  if (user.token != undefined) {
    return <Navigate to="/" />;
  }

  const onSubmit = () => {
    const URL = "/api/users/register"; // proxied to backend
    const payload = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      userType: "instructor",
    };
    dispatch(authFunction(payload, URL));
  };

  return (
    <div>
      <div className="loginDiv">
        <h4>Become a Udemy Instructor</h4>
        <hr className="hr_line_login" />

        <p style={{ margin: "0 30px 16px", color: "#2d2f31", lineHeight: 1.4 }}>
          Discover a supportive community of online instructors. Get instant
          access to all course creation resources.
        </p>

        <div className="login_inputDiv">
          {error ? (
            <Alert className="alert" severity="error">
              <p>There was a problem creating your instructor account.</p>
            </Alert>
          ) : null}

          <input
            onChange={handleChange}
            name="fullName"
            type="text"
            placeholder="Full name"
            className="login_pw"
            value={form.fullName}
          />
          <input
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email"
            className="login_pw"
            value={form.email}
          />
          <input
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Password"
            className="login_pw"
            value={form.password}
          />

          <div
            className="checkboxDiv"
            style={{ marginTop: 12, marginBottom: 8 }}
          >
            <input
              id="instructor_sub"
              name="subscribe"
              type="checkbox"
              className="signup_checkbox"
              checked={form.subscribe}
              onChange={handleChange}
            />
            <label
              htmlFor="instructor_sub"
              style={{ marginLeft: 8, fontSize: "0.9rem", lineHeight: 1.4 }}
            >
              I want to get the most out of my experience, by receiving emails
              with insider tips, motivation, special updates and promotions
              reserved for instructors.
            </label>
          </div>

          <ColorButton onClick={onSubmit} id="signup_input">
            {loading ? (
              <CircularProgress style={{ color: "white" }} />
            ) : (
              "Sign up"
            )}
          </ColorButton>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
