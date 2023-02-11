import "./Home.css";
import NavigationBar from "./NavigationBar";
import InitialAppPreferences from "./InitialAppPreferences";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banks from "./Banks";
import HomePage from "./HomePage";
import EnterIncomePage from "./EnterIncomePage";

function Home() {
  const navigate = useNavigate();
  const [launched, setLaunched] = useState(false);
  const [banksChecked, setBanksChecked] = useState(false);
  const [income, setIncome] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user") || null;
    if (!user) {
      navigate("/login");
    }
    const data = {
      email: user,
    };
    if (sessionStorage.getItem("launched") === "yes") {
      setLaunched(true);
    }
    if (sessionStorage.getItem("banksChecked") === "yes") {
      setBanksChecked(true);
    }
    if (sessionStorage.getItem("income") === "yes") {
      setIncome(true);
    }
  }, []);

  if (launched && banksChecked && !income) {
    return (
      <div className="home_content">
        <div>
          <NavigationBar />
          <EnterIncomePage />
        </div>
      </div>
    );
  } else if (!launched) {
    return (
      <div className="home_content">
        <NavigationBar />
        <InitialAppPreferences />
      </div>
    );
  } else if (launched && !banksChecked) {
    return (
      <div className="home_content">
        <div>
          <NavigationBar />
          <Banks />
        </div>
      </div>
    );
  } else if (launched && banksChecked && income) {
    return (
      <div className="home_content">
        <NavigationBar />
        <HomePage />
      </div>
    );
  }
}

export default Home;
