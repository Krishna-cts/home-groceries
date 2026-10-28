import React, { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signIn({
        username,
        password,
        options: { authFlowType: "USER_PASSWORD_AUTH" }
      });
      sessionStorage.setItem("isLoggedIn", "true");
      alert("Login successful ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <h2>Home Groceries</h2>
      <p>Manage your daily essentials effortlessly</p>
      
      <input 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      
      <input 
        style={styles.input} 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      
      <button type="submit">Login</button>
      
      <p 
        style={{ cursor: "pointer", color: "blue" }} 
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </p>
      
      <p style={{ marginTop: "10px" }}>New user?</p>
      
      <button 
        style={styles.secondaryButton} 
        onClick={() => navigate("/signup")}
      >
        Go to Signup
      </button>
    </form>
  );
}

export default Login;
