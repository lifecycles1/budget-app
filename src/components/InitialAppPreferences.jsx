import "./InitialAppPreferences.css";
import svgChart from "../assets/chart.svg";
import chartRotated from "../assets/chart-rotated.svg";
import wallet from "../assets/wallet.svg";
import chartPie from "../assets/chart-pie.svg";
import piggyBank from "../assets/piggy-bank.svg";
import invoice from "../assets/invoice.svg";
import upArrow from "../assets/up-arrow.svg";
import scissors from "../assets/scissors.svg";
import caretRight from "../assets/caret-right.svg";
import { useState } from "react";

function InitialAppPreferences() {
  // button animation similar to the :active CSS selector
  const [touched, setTouched] = useState(false);
  // first page of preferences
  const [goals, setGoals] = useState([]);
  // boolean to proceed to second page of preferences
  const [proceed, setProceed] = useState(false);
  // get user from signup process to match and update same row in database when dispatching preferences
  const user = sessionStorage.getItem("user");

  /**
   *
   * @function selected {collect account preferences upon signup}
   * getting the first className from the selected element (className is a number that matches the id
   * number of its parent div), then conditionally adding the className "selected" to its parent div
   * so we can highlight it by changing its colors!
   * also storing the texts of the selected elements in the state array "goals"
   * so we can then send the users preferences into the database
   */
  const selected = (e) => {
    const selected = e.target.className[0];
    const text = document.getElementById(selected).innerText;
    if (goals.includes(text)) {
      document.getElementById(selected).classList.remove("selected"); // removing css class
      setGoals(goals.filter((goal) => goal !== text)); // de-selecting
    } else {
      document.getElementById(selected).classList.add("selected"); //adding css class for styling
      setGoals([...goals, text]); //storing new selections (text) and keep the existing (...goals)
    }
  };

  // button to proceed to second page of preferences (statistics)
  const next = () => {
    setProceed(true);
  };

  const selected2 = (e) => {
    const selected2 = e.target.className[0] + "_prelaunch";
    const statistics = document.getElementById(selected2).innerText;
    const data = { user, goals, statistics };
    // posting below to node server which will then post to database (in order to post to google sheets -
    // web apps require user consent via an oauth2 flow. Since user is not using google sheets directly -
    // if we build an oauth2 flow and force users to consent they will not know why they are being asked
    // to consent, hence the need for a node server where we can use google's server-to-server (promptless)
    // oauth2 flow library for servers which doesn't require user interaction and consent) (so we can use
    // google sheets as our database)
    // also added a proxy in package.json pointing to the node server in order to avoid CORS error
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/preferences", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (JSON.parse(response) === "saved") {
          console.log("response", JSON.parse(response));
          sessionStorage.setItem("launched", "yes");
          window.location.reload();
        }
      }
    };
  };

  const skip = () => {
    const data = { user, goals, statistics: "skipped" };
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/preferences", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (JSON.parse(response) == "saved") {
          console.log("response", JSON.parse(response));
          sessionStorage.setItem("launched", "yes");
          window.location.reload();
        }
      }
    };
  };

  /**
   *
   * @param {proceed} proceed to the next step of the signup process.
   * @return {boolean}
   * block of code used only during the signup process
   */
  if (!proceed) {
    return (
      <div className="preferences_content">
        <div className="intro_question">What are your goals?</div>
        <div className="grid_container">
          <div id="1" onClick={selected} className="1 grid_item">
            <img className="1 svg-chart" src={svgChart} alt="chart" />
            <p className="1">Start Investing</p>
          </div>
          <div id="2" onClick={selected} className="2 grid_item">
            <img className="2 svg-chart-rotated" src={chartRotated} alt="chart-rotated" />
            <p className="2">Lower my bills</p>
          </div>
          <div id="3" onClick={selected} className="3 grid_item">
            <img className="3 svg-wallet" src={wallet} alt="wallet" />
            <p className="3">Track my spending</p>
          </div>
          <div id="4" onClick={selected} className="4 grid_item">
            <img className="4 svg-pie-chart" src={chartPie} alt="chart-pie" />
            <p className="4">Create a budget</p>
          </div>
          <div id="5" onClick={selected} className="5 grid_item">
            <img className="5 svg-piggy-bank" src={piggyBank} alt="piggy-bank" />
            <p className="5">Grow my savings</p>
          </div>
          <div id="6" onClick={selected} className="6 grid_item">
            <img className="6 svg-invoice" src={invoice} alt="invoice" />
            <p className="6">Pay my bills on time</p>
          </div>
          <div id="7" onClick={selected} className="7 grid_item">
            <img className="7 svg-up-arrow" src={upArrow} alt="up-arrow" />
            <p className="7">Grow my investments</p>
          </div>
          <div id="8" onClick={selected} className="8 grid_item">
            <img className="8 svg-scissors" src={scissors} alt="scissors" />
            <p className="8">Reduce my debt</p>
          </div>
          <div className="next_button_div">
            <button onClick={next} className="next_button" onMouseDown={() => setTouched(true)} onMouseUp={() => setTouched(false)} style={{ opacity: touched ? 0.5 : 1, transition: "opacity 200ms ease" }}>
              Next
              <div className="svg-next-div">
                <svg className="svg-next-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="white" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (proceed) {
    return (
      <div className="preferences2_content">
        <div className="intro2_question">How did you hear about budget app?</div>
        <div className="intro2_small_text">Let us know &#128071;</div>
        <div className="grid2_container">
          <div id="1_prelaunch" onClick={selected2} className="1 grid2_item">
            <div className="1">A social media or online ad</div>
            <img className="1 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div id="2_prelaunch" onClick={selected2} className="2 grid2_item">
            <div className="2">A social media post</div>
            <img className="2 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div id="3_prelaunch" onClick={selected2} className="3 grid2_item">
            <div className="3">Searching online</div>
            <img className="3 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div id="4_prelaunch" onClick={selected2} className="4 grid2_item">
            <div className="4">An article, blog post or newsletter</div>
            <img className="4 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div id="5_prelaunch" onClick={selected2} className="5 grid2_item">
            <div className="5">A community group I am in</div>
            <img className="5 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div id="6_prelaunch" onClick={selected2} className="6 grid2_item">
            <div className="6">Someone told me</div>
            <img className="6 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div id="7_prelaunch" onClick={selected2} className="7 grid2_item">
            <div className="7">Other</div>
            <img className="7 svg-caret-right" src={caretRight} alt="caret-right" />
          </div>
          <div className="grid2_item" style={{ visibility: "hidden" }}>
            <div>hidden</div>
          </div>
          <div className="skip_button_div">
            <button onClick={skip} className="skip_button" onMouseDown={() => setTouched(true)} onMouseUp={() => setTouched(false)} style={{ opacity: touched ? 0.5 : 1, transition: "opacity 200ms ease" }}>
              Skip
              <div className="svg-skip-div">
                <svg className="svg-caret-right_skip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                  <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" fill="#413b63" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default InitialAppPreferences;
