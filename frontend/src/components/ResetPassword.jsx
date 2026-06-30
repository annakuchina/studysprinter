import React, { useState } from "react";
import { supabase } from "../supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import "../styles/base.css";
import "../styles/auth.css";

export default function ResetPassword({ onComplete }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdatePassword() {
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        if (error.message.includes("Password should contain")) {
          throw new Error(
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol.",
          );
        }
        throw error;
      }
      setMessage("Password updated! Redirecting you to your account...");
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <FontAwesomeIcon
            icon={faBookOpen}
            style={{ fontSize: 28, color: "white" }}
          />
        </div>
        <h1 className="login-title">Reset your password</h1>
        <p className="login-sub">
          Enter a new password for your StudySprinter account.
        </p>

        <input
          className="login-input"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUpdatePassword()}
          disabled={loading}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUpdatePassword()}
          disabled={loading}
        />

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-message">{message}</div>}

        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: 12 }}
          onClick={handleUpdatePassword}
          disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
