import React from 'react'
import './SignUp.css'

export const SignUp = () => {

    const getValues = () => {
    const form = document.getElementById('signup-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let name = document.getElementById('name_capture').value;
            let surname = document.getElementById('surname_capture').value;
            let email = document.getElementById('email_capture').value;
            let password = document.getElementById('password_capture').value;
            let confirmPassword = document.getElementById('confirm_password_capture').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
        });
}
  return (
    <main className="signup-page">

        <article className="signup-card">
        <header className="signup-logo-row">
          <figure className="signup-logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#4F46E5" />
              <path d="M10 16L14.6667 20L22 12" stroke="white" strokeWidth="2" />
            </svg>
          </figure>
          <h1 className="signup-logo-text">StokvelStokkie</h1>
        </header>

        <h2 className="signup-headline">Create your account</h2>
        <p className="signup-sub">Join StokvelStokkie to easily manage your stokvel contributions, payouts, and group savings.</p>

        <hr className="signup-divider" />

        <form id="signup-form" action="/google" method="POST">
          <input type="text" placeholder="Name" id="name_capture" name="name" required/>
          <input type="text" placeholder="Surname" id="surname_capture" name="surname" required/>
          <input type="email" height="1900px" placeholder="Email Address" id="email_capture" name="email" required/>
          <input type="password" placeholder="Password" id="password_capture" name="password" required/>
          <input type="password" placeholder="Confirm Password" id="confirm_password_capture" name="confirm_password" required/>
          
          <hr className="signup-divider" />

          <button type="submit" id="sign_up_button">Create Account</button>

           <p className="create-account-prompt">
          Already have an account? <a href="/">Sign in</a>.
        </p>

        </form>
        </article>

    </main>
  )
}
