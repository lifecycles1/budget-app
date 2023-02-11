import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EnterIncomePage.css";

function EnterIncomePage() {
  const [income, setIncome] = useState("");
  const [mortgage, setMortgage] = useState("");
  const [groceries, setGroceries] = useState("");
  const [insurance, setInsurance] = useState("");
  const [councilTax, setCouncilTax] = useState("");
  const [electricity, setElectricity] = useState("");
  const [gas, setGas] = useState("");
  const [water, setWater] = useState("");
  const [other, setOther] = useState("");

  const handleChange = (event) => {
    if (event.target.id === "income_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setIncome(result);
    }
    if (event.target.id === "mortgage_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setMortgage(result);
    }
    if (event.target.id === "groceries_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setGroceries(result);
    }
    if (event.target.id === "insurance_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setInsurance(result);
    }
    if (event.target.id === "counciltax_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setCouncilTax(result);
    }
    if (event.target.id === "electricity_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setElectricity(result);
    }
    if (event.target.id === "gas_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setGas(result);
    }
    if (event.target.id === "water_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setWater(result);
    }
    if (event.target.id === "other_input") {
      const result = event.target.value.replace(/[^0-9]/g, "");
      setOther(result);
    }
  };

  const handleSubmit = () => {
    if (income.length && mortgage.length && groceries.length && insurance.length && councilTax.length && electricity.length && gas.length && water.length && other.length) {
      document.getElementById("btn-spin").classList.add("button--loading");
      const email = sessionStorage.getItem("user");
      const data = {
        email: email,
        income: income,
        mortgage: mortgage,
        groceries: groceries,
        insurance: insurance,
        councilTax: councilTax,
        electricity: electricity,
        gas: gas,
        water: water,
        other: other,
      };
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "http://localhost:3001/setIncome", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var response = this.responseText;
          console.log("response", JSON.parse(response));
          if (JSON.parse(response) === "Income added") {
            sessionStorage.setItem("income", "yes");
            location.reload();
          }
        }
      };
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div>
      <div>
        <div className="income_container">
          <div className="income_title">Please enter your income and expenses</div>
          <div className="income_content">
            <div className="income_grid_container">
              <div className="income_divs">
                <label>Income</label>
                <input id="income_input" className="income_inputs" type="text" value={income} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Mortgage/Rent</label>
                <input id="mortgage_input" className="income_inputs" type="text" value={mortgage} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Groceries</label>
                <input id="groceries_input" className="income_inputs" type="text" value={groceries} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Insurance</label>
                <input id="insurance_input" className="income_inputs" type="text" value={insurance} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Council Tax</label>
                <input id="counciltax_input" className="income_inputs" type="text" value={councilTax} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Electricity</label>
                <input id="electricity_input" className="income_inputs" type="text" value={electricity} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Gas</label>
                <input id="gas_input" className="income_inputs" type="text" value={gas} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Water</label>
                <input id="water_input" className="income_inputs" type="text" value={water} onChange={handleChange} />
              </div>
              <div className="income_divs">
                <label>Other</label>
                <input id="other_input" className="income_inputs" type="text" value={other} onChange={handleChange} />
              </div>
            </div>
          </div>
          <button id="btn-spin" className="btn-spin" type="submit" onClick={handleSubmit}>
            <span className="button__text">Proceed</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnterIncomePage;
