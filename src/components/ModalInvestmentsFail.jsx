import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./ModalInvestmentsFail.css";
import xcircle from "../assets/circle-xmark.svg";

function ModalInvestmentsFail() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="modal_container">
      <div className="open_modal" onClick={handleShow}></div>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="modal_body">
            <div className="icon_div">
              <img src={xcircle} width={40} alt="xmark" />
            </div>
            <div className="message_div">
              <div>Hey, slow down &#128580;</div>
            </div>
            <div className="paragraph_div">
              <p>Budget app works at its best when a bank or credit card is connected first. Don&#39;t worry, you can add this provider later.</p>
            </div>
          </div>
        </Modal.Body>
        <button className="consent_button" onClick={handleClose}>
          Okay, let&#39;s do it!
        </button>
      </Modal>
    </div>
  );
}

export default ModalInvestmentsFail;
