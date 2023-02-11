import { useEffect, useState } from "react";
import "./Banks.css";
import { banks, stocksandshares, pensions, cryptoexchanges, cryptowallets, footerNote } from "../local_data/bank_data";
import searchIcon from "../assets/search.svg";
import ModalBanks from "./ModalBanks";
import ModalInvestmentsFail from "./ModalInvestmentsFail";
import ModalInvestmentsProceed from "./ModalInvestmentsProceed";

function Banks() {
  const [toggleState, setToggleState] = useState(1);
  // bankName captures the value from the search bar input field
  const [bankName, setBankName] = useState("");
  // page is displaying a copy of the banks array (banks1)
  // and search bar filters inplace the copied banks1 array
  const [banks1, setBanks1] = useState(banks);
  // a boolean indicating whether the fail modal should be displayed or not when clicking an investment (defaults to true if no bank is selected)
  const [displayInvestmentModal, setDisplayInvestmentModal] = useState(true);
  // passing bank name and image inside the bank modal
  const [passBankDetailsToBankModal, setPassBankDetailsToBankModal] = useState({});
  // passing investment name and image inside the investment modal
  const [passInvestmentDetailsToProceedModal, setPassInvestmentDetailsToProceedModal] = useState({});

  // 1. watches search input field value for changes and updates the changes into "bankName"
  // 2. filters the banks1 array based on the value of "bankName"
  // 3. this doesn't update the page (only the values) useEffect hook is used to update the page
  const handleChange = (e) => {
    setBankName(e.target.value);
    setBanks1(banks1.filter((bank) => bank[0].toLowerCase().includes(bankName.toLowerCase())));
  };

  // usEffect watches for changes in the search bar input field value [bankName]
  // also if bankName.length goes back down to 0 then the page is updated back with the full array
  useEffect(() => {
    if (bankName.length === 0) {
      setBanks1(banks);
    }
  }, [bankName]);

  // toggles between the 2 tabs (banks and investments)
  const toggleTab = (index) => {
    setToggleState(index);
  };

  // function that opens the bank modal that collects the selected bank
  const getBank = (e) => {
    const bank = banks1[e.target.getAttribute("a-key")][0];
    const image = banks1[e.target.getAttribute("a-key")][1];
    setPassBankDetailsToBankModal({ name: bank, image: image });
    document.getElementsByClassName("open_bank_modal")[0].click();
  };

  // function that handles clicks on each "stocks and shares" item in the investments tab
  // if no bank is selected - it opens a fail modal (info modal) asking the user to select a bank first
  // if a bank is selected - it opens the investment modal (final modal to proceed out of page)
  const getStock = (e) => {
    if (displayInvestmentModal) {
      document.getElementsByClassName("open_modal")[0].click();
      return;
    }
    openFinalProceedModal(stocksandshares, e, "b-key");
  };

  // handles clicks on each "pension" item in investments tab
  const getPension = (e) => {
    if (displayInvestmentModal) {
      document.getElementsByClassName("open_modal")[0].click();
      return;
    }
    openFinalProceedModal(pensions, e, "c-key");
  };

  // handles clicks on each "crypto exchange" item in investments tab
  const getCryptoExchange = (e) => {
    if (displayInvestmentModal) {
      document.getElementsByClassName("open_modal")[0].click();
      return;
    }
    openFinalProceedModal(cryptoexchanges, e, "d-key");
  };

  // handles clicks on each "crypto wallet" item in investments tab
  const getCryptoWallet = (e) => {
    if (displayInvestmentModal) {
      document.getElementsByClassName("open_modal")[0].click();
      return;
    }
    openFinalProceedModal(cryptowallets, e, "e-key");
  };

  // generic function that is called in the click functions of each item from the investments tab
  // it opens the investment modal (final modal to proceed out of the page) if a bank is selected
  // and is setting the investment details (name and image) to be passed into the investment modal
  const openFinalProceedModal = (investmentArray, event, key) => {
    const investment = investmentArray[event.target.getAttribute(key)][0];
    const image = investmentArray[event.target.getAttribute(key)][1];
    setPassInvestmentDetailsToProceedModal({ name: investment, image: image });
    document.getElementsByClassName("proceed_open_modal")[0].click();
  };

  // display html elements
  return (
    <div className="banks_page_container">
      <div className="tab_container">
        <div className="tab_buttons">
          <button className={toggleState === 1 ? "tabs active_tabs" : "tabs"} onClick={() => toggleTab(1)}>
            Everyday
          </button>
          <button className={toggleState === 2 ? "tabs active_tabs" : "tabs"} onClick={() => toggleTab(2)}>
            Investments
          </button>
        </div>

        <div className="content_tabs">
          <div className={toggleState === 1 ? "content  active_content" : "content"}>
            <div className="bank_search_div">
              <input value={bankName} onChange={handleChange} className="bank_search" type="text" placeholder="Search" />
              <img className="search_icon" src={searchIcon} width={13} />
              <div className="header_msg">Connect to your bank</div>
            </div>

            <div className="bank_content">
              {banks1.map((bank, i) => (
                <div a-key={i} onClick={getBank} key={i} className="bank">
                  <img className="bank_logo" a-key={i} src={bank[1]} alt={i} />
                  <div a-key={i} className="bank_text">
                    {bank[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={toggleState === 2 ? "content  active_content" : "content"}>
            <div className="investments_header_msg">Choose a way to invest</div>
            <div className="bank_content">
              {stocksandshares.map((stock, i) => (
                <div b-key={i} onClick={getStock} key={i} className="bank">
                  <div b-key={i} className="investment_type_div">
                    Stocks and Shares
                  </div>
                  <img b-key={i} className="bank_logo" src={stock[1]} alt={i} />
                  {stock[0]}
                </div>
              ))}
              {pensions.map((pension, i) => (
                <div c-key={i} onClick={getPension} key={i} className="bank">
                  <div c-key={i} className="investment_type_div">
                    Pensions
                  </div>
                  <img c-key={i} className="bank_logo" src={pension[1]} alt={i} />
                  {pension[0]}
                </div>
              ))}
              {cryptoexchanges.map((cryptoexchange, i) => (
                <div d-key={i} onClick={getCryptoExchange} key={i} className="bank">
                  <div d-key={i} className="investment_type_div">
                    Crypto Exchanges
                  </div>
                  <img d-key={i} className="bank_logo" src={cryptoexchange[1]} alt={i} />
                  {cryptoexchange[0]}
                </div>
              ))}
              {cryptowallets.map((cryptowallet, i) => (
                <div e-key={i} onClick={getCryptoWallet} key={i} className="bank">
                  <div e-key={i} className="investment_type_div">
                    Crypto Wallets
                  </div>
                  <img e-key={i} className="bank_logo" src={cryptowallet[1]} alt={i} />
                  {cryptowallet[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer_note">{footerNote}</div>
        {/* the element <ModalBanks /> itself is always hidden and is rather triggered when you click on any bank tile */}
        <ModalBanks bank={passBankDetailsToBankModal} setToggleState={setToggleState} setDisplayInvestmentModal={setDisplayInvestmentModal} />
        {/* the element <ModalInvestmentsFail /> is always hidden and is triggered when you click on an investment tile while not having a bank selected */}
        <ModalInvestmentsFail />
        {/* the element <ModalInvestmentsProceed /> is always hidden and is triggered when you click on an investment tile while having a selected bank */}
        <ModalInvestmentsProceed bank={passBankDetailsToBankModal} investment={passInvestmentDetailsToProceedModal} />
      </div>
    </div>
  );
}

export default Banks;
