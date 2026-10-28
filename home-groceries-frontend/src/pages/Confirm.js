import React, { useState } from "react"; 
import { confirmSignUp } from "aws-amplify/auth"; 
import { useNavigate } from "react-router-dom"; 
import styles from "../styles"; 

function Confirm() { 
  const [username, setUsername] = useState(""); 
  const [code, setCode] = useState(""); 
  const navigate = useNavigate(); 

  const handleConfirm = async () => { 
    try { 
      await confirmSignUp({ username, confirmationCode: code }); 
      alert("Account confirmed ✅"); 
      navigate("/"); 
    } catch (error) { 
      console.error(error); 
      alert("Confirmation failed ❌"); 
    } 
  }; 

  return ( 
    <div>
      <p>Verify Account</p> 
      <p>Enter OTP to activate your account</p> 
      <input style={styles.input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /> 
      <input style={styles.input} placeholder="Enter OTP" value={code} onChange={(e) => setCode(e.target.value)} /> 
      <button onClick={handleConfirm}>Confirm</button>
      <p style={{ fontSize: "12px", color: "gray" }}>Check your email for the verification code</p> 
    </div>
  ); 
} 

export default Confirm;
