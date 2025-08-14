// src/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./config"; // <— central API base

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1.jpg");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const avatars = [
    "avatar1.jpg","avatar2.jpg","avatar3.jpg","avatar4.jpg","avatar5.jpg",
    "avatar6.webp","avatar7.png","avatar8.jpg","avatar9.jpg","avatar10.jpg"
  ];

  const getCSRFTokenFromCookie = () => {
    const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !selectedAvatar) {
      setError("All fields including avatar selection are required.");
      return;
    }

    try {
      // prime CSRF cookie (safe even if not required)
      try { await fetch(`${API_BASE}/csrf/`, { credentials: "include" }); } catch {}

      const csrf = getCSRFTokenFromCookie();

      const response = await fetch(`${API_BASE}/api/register/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf
        },
        body: JSON.stringify({
          username,
          password,
          profile_picture: selectedAvatar, // backend expects this field
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // Success: send them to login (or auto-login if you prefer)
        navigate("/login");
      } else {
        setError(data.error || data.detail || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <video
        autoPlay muted loop playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
      >
        <source src="/register_wallpaper.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', sans-serif",
          position: 'relative'
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            padding: "2rem",
            borderRadius: "16px",
            maxWidth: "420px",
            width: "100%",
            color: "white",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "28px" }}>Register</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text" placeholder="Username" value={username}
              onChange={(e) => setUsername(e.target.value)} required
              style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "12px", borderRadius: "8px", border: "none" }}
            />

            <input
              type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "12px", borderRadius: "8px", border: "none" }}
            />

            <p style={{ marginBottom: "0.5rem" }}>Select an avatar:</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
                marginBottom: "1.25rem"
              }}
            >
              {avatars.map((avatar) => (
                <img
                  key={avatar}
                  src={`/avatars/${avatar}`}
                  alt={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: selectedAvatar === avatar ? "3px solid #8fdcff" : "2px solid gray",
                    cursor: "pointer",
                    objectFit: "cover",
                    transition: "transform 0.2s ease-in-out",
                    transform: selectedAvatar === avatar ? "scale(1.1)" : "scale(1)"
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!username || !password || !selectedAvatar}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: !username || !password || !selectedAvatar ? "#888" : "#8fdcff",
                border: "none",
                borderRadius: "8px",
                cursor: !username || !password || !selectedAvatar ? "not-allowed" : "pointer",
                color: "#000",
                fontWeight: "bold",
                fontSize: "16px"
              }}
            >
              Sign Up
            </button>

            {error && <p style={{ color: "#ff7f7f", marginTop: "1rem" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

