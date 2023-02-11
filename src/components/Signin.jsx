import "./Signin.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../assets/circle-arrow-left.svg";

function Signin() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [disableButton, setDisableButton] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById("btn-spin").classList.add("button--loading");
    setDisableButton(true);
    const data = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/signin", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        console.log("response", JSON.parse(response));
        if (JSON.parse(response) === "launched") {
          sessionStorage.setItem("user", data.email);
          sessionStorage.setItem("launched", "yes");
          navigate("/");
        } else if (JSON.parse(response) === "not launched") {
          sessionStorage.setItem("user", data.email);
          navigate("/");
        } else if (JSON.parse(response) === "launched with banks checked") {
          sessionStorage.setItem("user", data.email);
          sessionStorage.setItem("launched", "yes");
          sessionStorage.setItem("banksChecked", "yes");
          navigate("/");
        } else if (JSON.parse(response) === "launched with banks checked and income set") {
          sessionStorage.setItem("user", data.email);
          sessionStorage.setItem("launched", "yes");
          sessionStorage.setItem("banksChecked", "yes");
          sessionStorage.setItem("income", "yes");
          navigate("/");
        } else if (JSON.parse(response) === "wrong password") {
          document.getElementById("btn-spin").classList.remove("button--loading");
          setDisableButton(false);
          alert("Wrong password");
        } else if (JSON.parse(response) === "user not found") {
          document.getElementById("btn-spin").classList.remove("button--loading");
          setDisableButton(false);
          alert("User not found");
        }
      }
    };
  };

  const goBack = () => {
    navigate("/login");
  };

  return (
    <div className="signin_container">
      <div className="signin_content">
        <div className="back-arrow-div-signin">
          <img onClick={goBack} onMouseDown={() => setTouched(true)} onMouseUp={() => setTouched(false)} style={{ opacity: touched ? 0.5 : 1, transition: "opacity 200ms ease" }} src={backArrow} width={28} alt="back arrow" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="email_div">
            <label>Email</label>
            <input className="email_input" ref={emailRef} type="text" />
          </div>
          <div className="password_div">
            <label>Password</label>
            <input className="password_input" ref={passwordRef} type="password" />
          </div>
          <button id="btn-spin" className="btn-spin" disabled={disableButton} type="submit">
            <span className="button__text">Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
