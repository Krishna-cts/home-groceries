
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      await resetPassword({ username });
      alert("Verification code sent successfully.");
      setStep(2);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    try {
      setLoading(true);
      await confirmResetPassword({ username, confirmationCode: verificationCode, newPassword });
      alert("Password updated successfully.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2>Forgot Password</h2>
      
      {step === 1 && (
        <>
          <input 
            type="text" 
            placeholder="Username / Email" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }} 
          />
          <button 
            onClick={sendVerificationCode} 
            disabled={loading} 
            style={{ width: "100%", padding: "10px" }}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input 
            type="text" 
            placeholder="Verification Code" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)} 
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }} 
          />
          <input 
            type="password" 
            placeholder="New Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }} 
          />
          <button 
            onClick={updatePassword} 
            disabled={loading} 
            style={{ width: "100%", padding: "10px" }}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </>
      )}

      <div style={{ marginTop: "15px" }}>
        <button 
          onClick={() => navigate("/")} 
          style={{ width: "100%", padding: "10px" }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
