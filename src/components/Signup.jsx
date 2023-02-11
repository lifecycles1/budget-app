import "./Signup.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../assets/circle-arrow-left.svg";

function Signup() {
  const fNameRef = useRef(null);
  const lNameRef = useRef(null);
  const telephoneRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const navigate = useNavigate();
  const [disableButton, setDisableButton] = useState(false);
  const [touched, setTouched] = useState(false);

  // validate telephone input to only allow numbers
  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (isNaN(inputValue)) {
      telephoneRef.current.value = telephoneRef.current.value.slice(0, -1);
    }
  };

  // main signup function
  const handleSubmit = (e) => {
    e.preventDefault();

    // if any of the fields are empty, alert the user and return out of the function
    if (fNameRef.current.value === "" || lNameRef.current.value === "" || telephoneRef.current.value === "" || emailRef.current.value === "" || passwordRef.current.value === "" || confirmPasswordRef.current.value === "") {
      alert("please fill in all fields to access into your budget app");
      return;
    }

    // if the email is not valid, alert the user and return out of the function
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(emailRef.current.value)) {
      alert("Please enter a valid email address");
      return;
    }

    // check if password are the samae
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("Passwords do not match");
      return;
    }

    // validate password - add strength
    // check if password has at least 1 uppercase character
    const hasUpperCase = /[A-Z]/.test(passwordRef.current.value);
    // check if password has at least 1 of the following special characters (!@#$%^&*)
    const hasSpecial = /[!@#$%^&*]/.test(passwordRef.current.value);
    // check if password is at least 8 characters long
    const minLength = 8;

    // if any of the above conditions are not met, alert the user and return out of the function
    if (!hasUpperCase) {
      alert("Password must contain at least 1 uppercase character");
      return;
    }
    if (!hasSpecial) {
      alert("Password must contain at least 1 special character (!@#$%^&*)");
      return;
    }
    if (passwordRef.current.value.length < minLength) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // begin the loading-spinner animation and disable the button
    document.getElementById("btn-spin").classList.add("button--loading");
    setDisableButton(true);

    // gathering the data object to send to the server
    const data = {
      firstname: fNameRef.current.value,
      lastname: lNameRef.current.value,
      telephone: telephoneRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // sending the data object to the server
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/signup", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      // catching the response from the server
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        // conditionally checking what the response is and navigating the user
        if (JSON.parse(response) === "User added") {
          sessionStorage.setItem("user", data.email);
          navigate("/");
          // if the email is duplicate remove the loading-spinner animation and enable the button
        } else if (JSON.parse(response) === "duplicate") {
          document.getElementById("btn-spin").classList.remove("button--loading");
          setDisableButton(false);
          alert("Email already exists");
        }
      }
    };
  };

  const goBack = () => {
    navigate("/login");
  };

  return (
    <div className="signup_container">
      <div className="signup_content">
        <div className="back-arrow-div">
          <img onClick={goBack} onMouseDown={() => setTouched(true)} onMouseUp={() => setTouched(false)} style={{ opacity: touched ? 0.5 : 1, transition: "opacity 200ms ease" }} src={backArrow} width={28} alt="back arrow" />
        </div>
        <div className="signup_grid_container">
          <div className="signup_divs">
            <label>First Name</label>
            <input className="signup_inputs" ref={fNameRef} type="text" />
          </div>
          <div className="signup_divs">
            <label>Last Name</label>
            <input className="signup_inputs" ref={lNameRef} type="text" />
          </div>
          <div className="signup_divs">
            <label>Telephone</label>
            <input className="signup_inputs" ref={telephoneRef} onChange={handleChange} type="text" />
          </div>
          <div className="signup_divs">
            <label>Email</label>
            <input className="signup_inputs" ref={emailRef} type="email" />
          </div>
          <div className="signup_divs">
            <label>Password</label>
            <input className="signup_inputs" ref={passwordRef} type="password" />
          </div>
          <div className="signup_divs">
            <label>Repeat Password</label>
            <input className="signup_inputs" ref={confirmPasswordRef} type="password" />
          </div>
        </div>
      </div>
      <button onClick={handleSubmit} id="btn-spin" className="btn-spin" disabled={disableButton} type="submit">
        <span className="button__text">Sign Up</span>
      </button>
    </div>
  );
}

export default Signup;
