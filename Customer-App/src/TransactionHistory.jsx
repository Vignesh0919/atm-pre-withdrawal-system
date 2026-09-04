import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  CreditCard,
  Banknote,
  MapPin,
  KeyRound,
  Clock3,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import "./TransactionHistory.css";

function TransactionHistory() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [hasInprocessWithdrawal, setHasInprocessWithdrawal] =
    useState(false);

  // ---------------------------------------------
  // LOAD LOCAL TRANSACTIONS
  // ---------------------------------------------

  const loadTransactions = () => {
    const savedTransactions = JSON.parse(
      localStorage.getItem("withdrawalTransactions") || "[]"
    );

    setTransactions(savedTransactions);

    const inprocess = savedTransactions.some(
      (transaction) => transaction.status === "Inprocess"
    );

    setHasInprocessWithdrawal(inprocess);
  };

  // ---------------------------------------------
  // CHECK ATM SERVER
  // ---------------------------------------------

  const checkATMStatus = async () => {
    const savedTransactions = JSON.parse(
      localStorage.getItem("withdrawalTransactions") || "[]"
    );

    // Find transaction which is still in process
    const inprocessTransaction = savedTransactions.find(
      (transaction) => transaction.status === "Inprocess"
    );

    // Nothing to check
    if (!inprocessTransaction) {
      setTransactions(savedTransactions);
      setHasInprocessWithdrawal(false);
      return;
    }

    try {
      console.log(
        "Checking ATM status for passcode:",
        inprocessTransaction.passcode
      );

      const response = await fetch(
        `http://localhost:5000/api/withdrawal/status?passcode=${encodeURIComponent(
          inprocessTransaction.passcode
        )}`
      );

      if (!response.ok) {
        console.log("ATM transaction still in process.");
        return;
      }

      const data = await response.json();

      console.log("ATM status response:", data);

      if (
        data.success &&
        data.withdrawal &&
        data.withdrawal.status === "Completed"
      ) {
        console.log(
          "ATM withdrawal completed successfully!"
        );

        // Update customer transaction
        const updatedTransactions =
          savedTransactions.map((transaction) => {
            if (
              String(transaction.passcode) ===
              String(data.withdrawal.passcode)
            ) {
              return {
                ...transaction,
                status: "Completed",
                result: "Successful",
              };
            }

            return transaction;
          });

        // Save updated transaction
        localStorage.setItem(
          "withdrawalTransactions",
          JSON.stringify(updatedTransactions)
        );

        // Update screen immediately
        setTransactions(updatedTransactions);

        setHasInprocessWithdrawal(false);
      }
    } catch (error) {
      console.log(
        "ATM server not reachable. Retrying..."
      );
    }
  };

  // ---------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------

  useEffect(() => {
    loadTransactions();
  }, []);

  // ---------------------------------------------
  // AUTOMATIC ATM STATUS CHECK
  // ---------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      checkATMStatus();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <div className="transaction-page">

      {/* HEADER */}

      <header className="transaction-header">

        <div className="transaction-header-left">

          <button
            className="transaction-back-button"
            onClick={() =>
              navigate("/atm-withdrawal")
            }
          >
            <ArrowLeft size={28} />
          </button>

          <h1>Transaction History</h1>

        </div>

        <div className="transaction-secure">

          <ShieldCheck size={30} />

          <div>
            <strong>100%</strong>
            <span>SECURE</span>
          </div>

        </div>

      </header>

      {/* CONTENT */}

      <main className="transaction-content">

        {transactions.length === 0 ? (

          <div className="no-transaction">

            <History
              size={60}
              strokeWidth={1.5}
            />

            <h2>
              No Withdrawal Transactions
            </h2>

            <p>
              Your withdrawal transactions will
              appear here.
            </p>

            <button
              onClick={() =>
                navigate("/withdraw-money")
              }
            >
              Withdraw Money
            </button>

          </div>

        ) : (

          <div className="transaction-wrapper">

            <div className="transaction-title">

              <div>

                <h2>
                  Withdrawal History
                </h2>

                <p>
                  Your recent ATM withdrawal
                  transactions
                </p>

              </div>

              <span>
                {transactions.length}{" "}
                {transactions.length === 1
                  ? "Transaction"
                  : "Transactions"}
              </span>

            </div>

            <div className="transaction-list">

              {transactions.map((transaction) => {

                const completed =
                  transaction.status ===
                  "Completed";

                return (
                  <div
                    className="transaction-card"
                    key={transaction.id}
                  >

                    {/* HEADER */}

                    <div className="transaction-card-header">

                      <div className="transaction-bank">

                        <div className="transaction-bank-icon">
                          <CreditCard size={24} />
                        </div>

                        <div>

                          <span>Bank</span>

                          <strong>
                            {transaction.bank}
                          </strong>

                        </div>

                      </div>

                      <div
                        className={`status-badge ${
                          completed
                            ? "completed-status"
                            : ""
                        }`}
                      >

                        {completed ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Clock3 size={16} />
                        )}

                        {completed
                          ? "Completed"
                          : "Inprocess"}

                      </div>

                    </div>

                    {/* CARD NUMBER */}

                    <div className="transaction-detail">

                      <div className="detail-icon">
                        <CreditCard size={19} />
                      </div>

                      <div>

                        <span>
                          Card Number
                        </span>

                        <strong>
                          **** **** ****{" "}
                          {transaction.cardNumber
                            .replace(/\s/g, "")
                            .slice(-4)}
                        </strong>

                      </div>

                    </div>

                    {/* AMOUNT */}

                    <div className="transaction-detail">

                      <div className="detail-icon">
                        <Banknote size={19} />
                      </div>

                      <div>

                        <span>
                          Amount Withdrawn
                        </span>

                        <strong className="withdraw-amount">
                          ₹
                          {Number(
                            transaction.amount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* ATM */}

                    <div className="transaction-detail">

                      <div className="detail-icon">
                        <MapPin size={19} />
                      </div>

                      <div>

                        <span>
                          ATM Selected
                        </span>

                        <strong>
                          {transaction.atmName}
                        </strong>

                        <small>
                          ATM ID:{" "}
                          {transaction.atmId}
                          {" • "}
                          {transaction.distance}
                        </small>

                      </div>

                    </div>

                    {/* PASSCODE */}

                    <div className="transaction-detail">

                      <div className="detail-icon">
                        <KeyRound size={19} />
                      </div>

                      <div>

                        <span>
                          Withdrawal Passcode
                        </span>

                        <strong className="transaction-passcode">
                          {transaction.passcode}
                        </strong>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="withdrawal-status-section">

                      <div>

                        <span>
                          Status of Withdrawal
                        </span>

                        <strong>
                          {completed
                            ? "Completed"
                            : "Inprocess"}
                        </strong>

                      </div>

                      <div className="status-line">

                        <div
                          className={`status-dot ${
                            completed
                              ? "completed-dot"
                              : ""
                          }`}
                        ></div>

                        <span>
                          {completed
                            ? "Withdrawal Successful"
                            : "Withdrawal request is being processed"}
                        </span>

                      </div>

                      {completed && (
                        <div className="successful-text">
                          ✓ Transaction Successful
                        </div>
                      )}

                    </div>

                    {/* DATE */}

                    <div className="transaction-date">

                      Transaction Date:{" "}
                      {transaction.date}

                    </div>

                  </div>
                );
              })}

            </div>

            {/* WITHDRAW BUTTON */}

            <button
              className="new-withdrawal-button"
              disabled={hasInprocessWithdrawal}
              onClick={() =>
                navigate("/withdraw-money")
              }
            >

              {hasInprocessWithdrawal
                ? "Withdrawal In Process"
                : "Withdraw Money"}

            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default TransactionHistory;