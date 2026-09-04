import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Banknote,
  History,
  Plus,
  ShieldCheck,
} from "lucide-react";

import "./ATMWithdrawal.css";

function ATMWithdrawal() {

  const navigate = useNavigate();

  return (
    <div className="atm-page">

      {/* Header */}
      <header className="atm-header">

        <div className="header-left">

          <button
  className="back-button"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={30} />
</button>

          <div className="paytm-logo">
            pay<span>tm</span>
          </div>

        </div>


        <div className="secure-payment">

          <ShieldCheck size={38} />

          <div>
            <strong>100%</strong>
            <span>SECURE PAYMENTS</span>
          </div>

        </div>

      </header>


      {/* Main Content */}
      <main className="atm-content">

        <h1>ATM Services</h1>

        <p className="atm-subtitle">
          Manage your cards and withdraw money easily
        </p>


        {/* Four Options */}
        <div className="atm-options">


          {/* 1. Add Debit Card */}
          <div
  className="atm-option"
  onClick={() => navigate("/add-debit-card")}   
>

            <div className="option-icon">

              <div className="card-icon-wrapper">

                <CreditCard size={70} strokeWidth={1.6} />

                <div className="plus-icon">
                  <Plus size={22} strokeWidth={2.5} />
                </div>

              </div>

            </div>

            <h2>
              Add Your
              <br />
              Debit Card
            </h2>

            <ArrowRight
              className="option-arrow"
              size={30}
            />

          </div>


          {/* 2. View Debit Card */}
<div
  className="atm-option"
  onClick={() => navigate("/view-debit-card")}
>

            <div className="option-icon">

              <div className="card-icon-wrapper">

                <CreditCard size={70} strokeWidth={1.6} />

                <div className="masked-number">
                  **** **** **** 1234
                </div>

              </div>

            </div>

            <h2>
              View Your
              <br />
              Debit Card
            </h2>

            <ArrowRight
              className="option-arrow"
              size={30}
            />

          </div>


          {/* 3. Withdraw Money */}
          <div
  className="atm-option"
  onClick={() => navigate("/withdraw-money")}
>
  <div className="option-icon">
    <Banknote size={55} />
  </div>

  <h2>Withdraw Money</h2>

  <ArrowRight className="option-arrow" />
</div>


          {/* 4. Transaction History */}
         <div
  className="atm-option"
  onClick={() => navigate("/transaction-history")}
>
  <div className="option-icon">
    <History size={55} />
  </div>

  <h2>Transaction History</h2>

  <ArrowRight className="option-arrow" />
</div>

        </div>

      </main>

    </div>
  );
}

export default ATMWithdrawal;