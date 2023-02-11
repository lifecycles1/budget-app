import "./HomePage.css";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import LoadingPage from "./LoadingPage";
import TodoNotes from "./TodoNotes";
import MyCalendar from "./MyCalendar";

function HomePage() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [income, setIncome] = useState();

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#ff6384", "#32a850", "#a83265", "#080b6e", "#08586e", "#cc5104", "#97cc04", "#cc041b"],
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: "expenses" } },
  };

  // React's useEffect hook runs every time the page loads / refreshes / or if you add some variables in the dependency array which is
  // at the end of the function "[]" the function will re-run every time any of those variables' value changes
  useEffect(() => {
    const email = sessionStorage.getItem("user");
    const data = { email: email };
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/getIncome", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        const responseJSON = JSON.parse(response);
        if (responseJSON.status === "success") {
          delete responseJSON.status;
          delete responseJSON.email;
          delete responseJSON._id;
          setIncome(responseJSON.income);
          delete responseJSON.income;
          Object.entries(responseJSON).map((item) => {
            setLabels((labels) => [...labels, item[0]]);
            setValues((values) => [...values, item[1]]);
          });
        }
      }
    };
  }, []);

  const totalExpenses = values.reduce((a, b) => a + b, 0);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // old mongodb chart (not in use)

  // const sdk = new ChartsEmbedSDK({
  //   baseUrl: "https://charts.mongodb.com/charts-main-vnscz",
  //   // showAttribution: false,
  // });
  // const chart = sdk.createChart({ chartId: "63a08f16-17c1-401f-8a14-2501519ae80a", height: 300, width: 400 });
  // setTimeout(() => {
  //   chart.render(document.getElementById("chart")).then(() => {
  //     chart.setFilter({ email: email });
  //     chart.setTheme("dark");
  //     chart.setAutoRefresh(true);
  //     chart.setMaxDataAge(5);
  //   });
  // }, 1000);
  // const refresh = () => {
  //   chart.refresh();
  // };

  // old mongo chart div used to be rendered inside the html block
  // <div id="chart">OLD MONGO CHART</div>

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  if (totalExpenses > income) {
    return (
      // RED block - WARNING that your total expenses are higher than your income
      <div className="overall_parent">
        <div className="home_container">
          <div className="div_chartjs_chart">
            <Bar className="chartjs_chart" options={options} data={data} />
          </div>
          <div className="tooltip_div" style={{ backgroundColor: "#cc4227" }}>
            <div className="div_header">Tip:</div>
            <div className="div_border"></div>
            <div className="div_text">Oops! Your expenses are exceeding your income by &#163;{totalExpenses - income}!!!</div>
          </div>
        </div>
        <div>
          <TodoNotes />
        </div>
        <div>
          <MyCalendar />
        </div>
      </div>
    );
  } else if (totalExpenses < income) {
    return (
      // GREEN block - message that your income is safely higher than your total expenses
      <div className="overall_parent">
        <div className="home_container">
          <div className="div_chartjs_chart">
            <Bar className="chartjs_chart" options={options} data={data} />
          </div>
          <div className="tooltip_div" style={{ backgroundColor: "#50d973" }}>
            {/* &#163; pound sterling sign html code */}
            <div className="div_header">Tip:</div>
            <div className="div_border"></div>
            <div className="div_text">Awesome! You saved &#163;{income - totalExpenses}</div>
          </div>
        </div>
        <div>
          <TodoNotes />
        </div>
        <div>
          <MyCalendar />
        </div>
      </div>
    );
  } else if (totalExpenses == income) {
    return (
      // YELLOW block - message that your income exactly the same as your total expenses
      <div className="overall_parent">
        <div className="home_container">
          <div className="div_chartjs_chart">
            <Bar className="chartjs_chart" options={options} data={data} />
          </div>
          <div className="tooltip_div" style={{ backgroundColor: "#e6e683" }}>
            {/* &#163; pound sign html code */}
            <div className="div_header">Tip:</div>
            <div className="div_border"></div>
            <div className="div_text">Wow! Your expenses are exactly equal to your income this month</div>
          </div>
        </div>
        <div>
          <TodoNotes />
        </div>
        <div>
          <MyCalendar />
        </div>
      </div>
    );
  } else {
    // LOADING PAGE (while retrieving data from the database and calculating the total expenses)
    return <LoadingPage />;
  }
}

export default HomePage;
