import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("OIP.jpg");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const avatars = [
    "avatar1.jpg",
    "avatar2.jpg",
    "avatar3.jpg",
    "avatar4.jpg",
    "avatar5.jpg",
    "avatar6.webp",
    "avatar7.png"
    ];



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !selectedAvatar) {
        setError("All fields including avatar selection are required.");
        return;
    }

    try {
        const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password,
            profile_picture: selectedAvatar
        })
        });

        const data = await response.json();
        if (response.ok) {
        navigate("/dashboard");
        } else {
        setError(data.error || "Registration failed");
        }
    } catch (err) {
        setError("Something went wrong. Please try again.");
    }
    };


  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <p>Select an avatar:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "1rem" }}>
          {avatars.map((avatar) => (
            <img
              key={avatar}
              src={`/avatars/${avatar}`}
              alt={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: selectedAvatar === avatar ? "3px solid #4A90E2" : "2px solid gray",
                cursor: "pointer",
                objectFit: "cover"
              }}
            />
          ))}
        </div>
        <button
            type="submit"
            disabled={!username || !password || !selectedAvatar}
            style={{
                padding: "10px 16px",
                backgroundColor: (!username || !password || !selectedAvatar) ? "#ccc" : "#4A90E2",
                cursor: (!username || !password || !selectedAvatar) ? "not-allowed" : "pointer",
                color: "white",
                border: "none",
                borderRadius: "4px"
            }}
            >
            Sign Up
            </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;