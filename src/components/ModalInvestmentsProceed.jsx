import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./ModalInvestmentsProceed.css";
import checkIcon from "../assets/check.svg";

function ModalInvestmentsProceed({ bank, investment }) {
  const [show, setShow] = useState(false);
  const user = sessionStorage.getItem("user");
  const [disableButton, setDisableButton] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const handleProceed = () => {
    const data = { user, bank: bank.name, investment: investment.name };
    setDisableButton(true);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/banksChecked", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (JSON.parse(response) === "saved") {
          console.log("response", JSON.parse(response));
          sessionStorage.setItem("banksChecked", "yes");
          setShow(false);
          window.location.reload();
        }
      }
    };
  };

  return (
    <div className="proceed_modal_container">
      <div className="proceed_open_modal" onClick={handleShow}></div>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="proceed_modal_body">
            <div className="proceed_modal_logo_div">
              <img className="proceed_modal_logo" src={investment.image} alt="inv_img" />
            </div>
            <div className="proceed_message_div">
              <div>Invest with {investment.name}</div>
              <div>Transparency with your investments</div>
            </div>
            <div className="proceed_paragraph_div">
              <div className="proceed_paragraph_body_container">
                <div className="proceed_paragraph_body_item">
                  <img className="check-icon" src={checkIcon} alt="check" />
                  <div className="proceed_paragraph_body_text_div">
                    <div className="proceed_paragraph_body_text">Trusted</div>
                    <p className="proceed_paragraph_body_text">Chosen and trusted by our clients for over 10 years</p>
                  </div>
                </div>
                <div className="proceed_paragraph_body_item">
                  <img className="check-icon" src={checkIcon} alt="check" />
                  <div className="proceed_paragraph_body_text_div">
                    <div className="proceed_paragraph_body_text">Protected</div>
                    <p className="proceed_paragraph_body_text">Client assets are held separately with Fake Street, per regulatory requirements</p>
                  </div>
                </div>
                <div className="proceed_paragraph_body_item">
                  <img className="check-icon" src={checkIcon} alt="check" />
                  <div className="proceed_paragraph_body_text_div">
                    <div className="proceed_paragraph_body_text">Recognised</div>
                    <p className="proceed_paragraph_body_text">Budget app has been awarded Easy Win 2022</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <button className="proceed_consent_button" onClick={handleProceed} disabled={disableButton}>
          <span className="proceed_consent_button_text">Continue</span>
        </button>
      </Modal>
    </div>
  );
}

export default ModalInvestmentsProceed;
