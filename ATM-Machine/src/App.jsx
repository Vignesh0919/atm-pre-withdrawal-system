import { useEffect, useState } from "react";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  Banknote,
  CreditCard,
  MapPin,
  CheckCircle,
} from "lucide-react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("welcome");

  const [passcode, setPasscode] = useState("");
  const [atmPin, setAtmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [withdrawal, setWithdrawal] = useState(null);

  // Cash dispensing
  const [dispensingAmounts, setDispensingAmounts] = useState([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);

  // --------------------------------------------------
  // PASSCODE
  // --------------------------------------------------

  const handlePasscodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setPasscode(value);
    setError("");
  };

  // --------------------------------------------------
  // ATM PIN
  // --------------------------------------------------

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setAtmPin(value);
    setError("");
  };

  // --------------------------------------------------
  // VALIDATE PASSCODE + PIN
  // --------------------------------------------------

  const handleNext = async () => {
    if (passcode.length !== 6) {
      setError("Please enter your 6 digit passcode.");
      return;
    }

    if (atmPin.length !== 4 && atmPin.length !== 6) {
      setError("Please enter a valid 4 or 6 digit ATM PIN.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/withdrawal/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passcode,
            pin: atmPin,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError("Wrong Passcode or PIN");
        setLoading(false);
        return;
      }

      setWithdrawal(data.withdrawal);

      setError("");
      setLoading(false);

      setScreen("details");
    } catch (error) {
      console.error("ATM Validation Error:", error);

      setError(
        "Unable to connect to ATM server. Please try again."
      );

      setLoading(false);
    }
  };

  // --------------------------------------------------
  // BACK TO HOME
  // --------------------------------------------------

  const handleBack = () => {
    setScreen("welcome");

    setPasscode("");
    setAtmPin("");
    setError("");

    setWithdrawal(null);

    setDispensingAmounts([]);
    setCurrentStage(0);
    setCompletedAmount(0);
  };

  // --------------------------------------------------
  // CREATE CASH DISPENSING STAGES
  // --------------------------------------------------

  const createDispensingStages = (amount) => {
    const stages = [];

    let remainingAmount = Number(amount);

    while (remainingAmount > 0) {
      const chunk = Math.min(25000, remainingAmount);

      stages.push(chunk);

      remainingAmount -= chunk;
    }

    return stages;
  };

  // --------------------------------------------------
  // CONFIRM WITHDRAWAL
  // --------------------------------------------------

  const handleConfirmWithdrawal = () => {
    if (!withdrawal) {
      return;
    }

    const stages = createDispensingStages(
      withdrawal.amount
    );

    setDispensingAmounts(stages);

    setCurrentStage(0);

    setCompletedAmount(0);

    setScreen("dispensing");
  };

  // --------------------------------------------------
  // AUTOMATIC CASH DISPENSING
  // --------------------------------------------------

  useEffect(() => {
    if (screen !== "dispensing") {
      return;
    }

    if (
      dispensingAmounts.length === 0 ||
      !dispensingAmounts[currentStage]
    ) {
      return;
    }

    // Wait 5 seconds before completing
    // the current cash dispensing stage.
    const timer = setTimeout(async () => {
      const currentAmount =
        dispensingAmounts[currentStage];

      const newCompletedAmount =
        completedAmount + currentAmount;

      setCompletedAmount(newCompletedAmount);

      // ----------------------------------------------
      // LAST STAGE
      // ----------------------------------------------

      if (
        currentStage ===
        dispensingAmounts.length - 1
      ) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/withdrawal/complete",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            alert(
              "Unable to complete withdrawal."
            );

            return;
          }

          // Show final success screen
          setScreen("success");

          // Return to home after 4 seconds
          setTimeout(() => {
            setWithdrawal(null);

            setPasscode("");
            setAtmPin("");
            setError("");

            setDispensingAmounts([]);
            setCurrentStage(0);
            setCompletedAmount(0);

            setScreen("welcome");
          }, 4000);
        } catch (error) {
          console.error(
            "Completion Error:",
            error
          );

          alert(
            "Unable to connect to ATM server."
          );
        }

        return;
      }

      // ----------------------------------------------
      // NEXT ₹25,000
      // ----------------------------------------------

      setCurrentStage(
        (previousStage) => previousStage + 1
      );
    }, 5000);

    // Cleanup timer if screen changes
    return () => clearTimeout(timer);
  }, [
    screen,
    currentStage,
    dispensingAmounts,
    completedAmount,
  ]);

  // --------------------------------------------------
  // WELCOME SCREEN
  // --------------------------------------------------

  if (screen === "welcome") {
    return (
      <div className="atm-machine">
        <div className="atm-screen">

          <header className="atm-header">
            <div className="atm-bank-name">
              ATM MACHINE
            </div>

            <div className="atm-welcome">
              WELCOME
            </div>
          </header>

          <main className="atm-main welcome-main">

            <div className="welcome-message">

              <LockKeyhole size={55} />

              <h1>Welcome</h1>

              <p>
                Please use your pre-withdrawal
                passcode to continue your
                transaction.
              </p>

            </div>

            <button
              className="passcode-button"
              onClick={() =>
                setScreen("passcode")
              }
            >
              ENTER YOUR PASSCODE
            </button>

          </main>

          <footer className="atm-footer">
            <span>
              SECURE ATM SERVICE
            </span>

            <span>
              PLEASE PROTECT YOUR PIN
            </span>
          </footer>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PASSCODE SCREEN
  // --------------------------------------------------

  if (screen === "passcode") {
    return (
      <div className="atm-machine">
        <div className="atm-screen">

          <header className="atm-header">
            <div className="atm-bank-name">
              ATM MACHINE
            </div>

            <div className="atm-welcome">
              AUTHENTICATION
            </div>
          </header>

          <main className="atm-main">

            <div className="form-container">

              <div className="form-icon">
                <ShieldCheck size={50} />
              </div>

              <h1>Enter Details</h1>

              <p className="form-subtitle">
                Enter your 6 digit withdrawal
                passcode and ATM PIN.
              </p>

              <div className="input-group">

                <label>
                  WITHDRAWAL PASSCODE
                </label>

                <input
                  type="password"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  placeholder="Enter 6 digit passcode"
                  maxLength={6}
                  inputMode="numeric"
                />

              </div>

              <div className="input-group">

                <label>ATM PIN</label>

                <input
                  type="password"
                  value={atmPin}
                  onChange={handlePinChange}
                  placeholder="Enter 4 or 6 digit PIN"
                  maxLength={6}
                  inputMode="numeric"
                />

              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="button-row">

                <button
                  className="back-button"
                  onClick={handleBack}
                >
                  <ArrowLeft size={18} />
                  BACK
                </button>

                <button
                  className="next-button"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading
                    ? "VERIFYING..."
                    : "NEXT"}
                </button>

              </div>

            </div>

          </main>

          <footer className="atm-footer">
            <span>
              SECURE ATM SERVICE
            </span>

            <span>
              DO NOT SHARE YOUR PIN
            </span>
          </footer>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // WITHDRAWAL DETAILS
  // --------------------------------------------------

  if (screen === "details") {
    return (
      <div className="atm-machine">
        <div className="atm-screen">

          <header className="atm-header">
            <div className="atm-bank-name">
              ATM MACHINE
            </div>

            <div className="atm-welcome">
              WITHDRAWAL DETAILS
            </div>
          </header>

          <main className="atm-main">

            <div className="details-container">

              <div className="verified-icon">
                <CheckCircle size={50} />
              </div>

              <h1>
                Withdrawal Verified
              </h1>

              <p className="details-subtitle">
                Please verify the transaction
                details
              </p>

              <div className="details-card">

                <div className="detail-row">

                  <div className="detail-label">
                    <Banknote size={20} />
                    <span>Bank</span>
                  </div>

                  <strong>
                    {withdrawal?.bank}
                  </strong>

                </div>

                <div className="detail-row">

                  <div className="detail-label">
                    <CreditCard size={20} />
                    <span>
                      Card Number
                    </span>
                  </div>

                  <strong>
                    **** **** ****{" "}
                    {withdrawal?.cardNumber
                      ?.replace(/\s/g, "")
                      .slice(-4)}
                  </strong>

                </div>

                <div className="detail-row">

                  <div className="detail-label">
                    <Banknote size={20} />
                    <span>
                      Withdrawal Amount
                    </span>
                  </div>

                  <strong className="withdrawal-amount">
                    ₹
                    {Number(
                      withdrawal?.amount
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

                <div className="detail-row">

                  <div className="detail-label">
                    <MapPin size={20} />
                    <span>ATM</span>
                  </div>

                  <strong>
                    {withdrawal?.atmName}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>ATM ID</span>

                  <strong>
                    {withdrawal?.atmId}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>Distance</span>

                  <strong>
                    {withdrawal?.distance}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>Date</span>

                  <strong>
                    {withdrawal?.date}
                  </strong>

                </div>

              </div>

              <div className="button-row">

                <button
                  className="back-button"
                  onClick={handleBack}
                >
                  <ArrowLeft size={18} />
                  CANCEL
                </button>

                <button
                  className="confirm-button"
                  onClick={
                    handleConfirmWithdrawal
                  }
                >
                  CONFIRM WITHDRAWAL
                </button>

              </div>

            </div>

          </main>

          <footer className="atm-footer">
            <span>
              SECURE ATM SERVICE
            </span>

            <span>
              PLEASE VERIFY THE AMOUNT
            </span>
          </footer>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // AUTOMATIC CASH DISPENSING SCREEN
  // --------------------------------------------------

  if (screen === "dispensing") {
    const currentAmount =
      dispensingAmounts[currentStage] || 0;

    const totalAmount =
      Number(withdrawal?.amount || 0);

    const stageNumber =
      currentStage + 1;

    const totalStages =
      dispensingAmounts.length;

    return (
      <div className="atm-machine">
        <div className="atm-screen">

          <header className="atm-header">

            <div className="atm-bank-name">
              ATM MACHINE
            </div>

            <div className="atm-welcome">
              CASH DISPENSING
            </div>

          </header>

          <main className="atm-main">

            <div className="dispensing-container">

              <div className="dispensing-icon">
                <Banknote size={65} />
              </div>

              <h1>
                CASH DISPENSING
              </h1>

              <p className="dispensing-subtitle">
                Please wait while the ATM
                dispenses your cash.
              </p>

              <div className="stage-counter">
                STEP {stageNumber} OF{" "}
                {totalStages}
              </div>

              <div className="dispensing-card">

                <div className="dispensing-status">
                  IN PROCESS
                </div>

                <div className="dispensing-amount">
                  ₹
                  {currentAmount.toLocaleString(
                    "en-IN"
                  )}
                </div>

                <div className="dispensing-text">
                  Cash amount being dispensed
                </div>

                <div className="automatic-message">
                  Please wait...
                </div>

              </div>

              <div className="progress-section">

                <div className="progress-label">

                  <span>
                    DISPENSED
                  </span>

                  <span>
                    ₹
                    {completedAmount.toLocaleString(
                      "en-IN"
                    )}
                    {" / "}
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        totalAmount > 0
                          ? (completedAmount /
                              totalAmount) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </main>

          <footer className="atm-footer">

            <span>
              TRANSACTION AMOUNT: ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </span>

            <span>
              PLEASE WAIT - DO NOT REMOVE CARD
            </span>

          </footer>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // SUCCESS SCREEN
  // --------------------------------------------------

  if (screen === "success") {
    return (
      <div className="atm-machine">
        <div className="atm-screen">

          <header className="atm-header">

            <div className="atm-bank-name">
              ATM MACHINE
            </div>

            <div className="atm-welcome">
              TRANSACTION COMPLETE
            </div>

          </header>

          <main className="atm-main">

            <div className="success-container">

              <div className="success-icon">
                <CheckCircle size={90} />
              </div>

              <h1>
                ₹
                {Number(
                  withdrawal?.amount || 0
                ).toLocaleString("en-IN")}
              </h1>

              <h2>
                Transaction Completed
              </h2>

              <p>
                Thank You
              </p>

              <div className="success-message">
                Your cash withdrawal has been
                completed successfully.
              </div>

              <div className="return-message">
                Returning to home...
              </div>

            </div>

          </main>

          <footer className="atm-footer">

            <span>
              TRANSACTION SUCCESSFUL
            </span>

            <span>
              THANK YOU FOR USING OUR ATM
            </span>

          </footer>

        </div>
      </div>
    );
  }

  return null;
}

export default App;