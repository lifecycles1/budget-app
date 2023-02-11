import "./Login.css";
import { useNavigate } from "react-router-dom";
import CarouselBanner from "./CarouselBanner";

function Login() {
  const navigate = useNavigate();

  const signup = () => {
    navigate("/signup");
  };

  const signin = () => {
    navigate("/signin");
  };

  return (
    <div className="login">
      <div>
        <div className="login_carousel_div">
          <CarouselBanner />
        </div>
        <div className="login_p_tags">
          <p className="greeting">Budget App is the #1 budgeting app in the world. We will help you get your finances on track and give the control you have always deserved.</p>
          <p className="account_p">
            Already have an account?
            <button onClick={signin} className="signin_btn">
              Sign In
            </button>
          </p>
        </div>
        <button onClick={signup} className="signup_btn">
          Sign up with Phone Number
        </button>
        <p className="terms">By signing up you agree to the T&C and Privacy Policy.</p> */
      </div>
    </div>
  );
}

export default Login;
