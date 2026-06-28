import React from "react";
import { supabase } from "../supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import "../styles/base.css";
import "../styles/sidebar.css";
import "../styles/forms.css";
import "../styles/study.css";
import "../styles/modals.css";
import "../styles/auth.css";

export default function Login() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
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
        <h1 className="login-title">StudySprinter</h1>
        <p className="login-sub">
          Turn your notes into flashcards and quizzes instantly.
        </p>
        <button className="login-google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={18}
            height={18}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
