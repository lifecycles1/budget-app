import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./ModalBanks.css";
import checkIcon from "../assets/check.svg";

function ModalBanks({ bank, setToggleState, setDisplayInvestmentModal }) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const handleCloseAndContinue = () => {
    setDisplayInvestmentModal(false);
    setToggleState(2);
    setShow(false);
  };

  return (
    <div className="bank_modal_container">
      <div className="open_bank_modal" onClick={handleShow}></div>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="bank_modal_body">
            <div className="bank_modal_logo_div">
              <img className="modal_bank_logo" src={bank.image} alt="bank_img" />
            </div>
            <div className="bank_message_div">
              <div>Connect to {bank.name}</div>
              <div>It&#39;s fast, secure and reliable to connect to your bank.</div>
            </div>
            <div className="bank_paragraph_div">
              <div className="permission_div">Give us permission to</div>
              <div className="bank_paragraph_body_container">
                <div className="bank_paragraph_body_item">
                  <img className="check-icon" src={checkIcon} alt="check" />
                  <div className="bank_paragraph_body_text_div">
                    <div className="bank_paragraph_body_text">Account details</div>
                    <p className="bank_paragraph_body_text">Access your account details to analyse your cash flow</p>
                  </div>
                </div>
                <div className="bank_paragraph_body_item">
                  <img className="check-icon" src={checkIcon} alt="check" />
                  <div className="bank_paragraph_body_text_div">
                    <div className="bank_paragraph_body_text">Transaction data</div>
                    <p className="bank_paragraph_body_text">Retrieve transaction data to provide smart insights</p>
                  </div>
                </div>
                <div className="bank_paragraph_body_item">
                  <img className="check-icon" src={checkIcon} alt="check" />
                  <div className="bank_paragraph_body_text_div">
                    <div className="bank_paragraph_body_text">90 days consent</div>
                    <p className="bank_paragraph_body_text">Ask you to reconsent every 90 days, to keep your account secure</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bank_modal_footer">Budget app uses open banking</div>
          </div>
        </Modal.Body>
        <button className="bank_consent_button" onClick={handleCloseAndContinue}>
          Continue
        </button>
      </Modal>
    </div>
  );
}

export default ModalBanks;
