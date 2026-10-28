import React, { useState } from "react";
import { signUp } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: { email }
        }
      });
      alert("Signup successful ✅");
      navigate("/confirm");
    } catch (error) {
      console.error(error);
      alert("Signup failed ❌");
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <p>Start tracking your purchases today</p>

      <input
        style={styles.input}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>

      <p style={{ marginTop: "10px" }}>Already have an account?</p>
      
      <button onClick={() => navigate("/")}>Go to Login</button>
    </div>
  );
}

export default Signup;
