import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  MapPin,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import "./WithdrawMoney.css";

function WithdrawMoney() {
  const navigate = useNavigate();
  const [hasInprocessWithdrawal, setHasInprocessWithdrawal] =
  useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [selectedAtm, setSelectedAtm] = useState("");

  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const [passcode, setPasscode] = useState("");

  useEffect(() => {
  const savedCards = JSON.parse(
    localStorage.getItem("savedDebitCards") || "[]"
  );

  setCards(savedCards);

  const savedTransactions = JSON.parse(
    localStorage.getItem("withdrawalTransactions") || "[]"
  );

  const inprocess = savedTransactions.some(
    (transaction) => transaction.status === "Inprocess"
  );

  setHasInprocessWithdrawal(inprocess);
}, []);
useEffect(() => {
  if (hasInprocessWithdrawal) { 
    alert(
      "A withdrawal is already in process. Please complete the current withdrawal before starting a new one."
    );

    navigate("/transaction-history");
  }
}, [hasInprocessWithdrawal, navigate]);

  // ATM list based on user's location
  const nearbyATMs = location
    ? [
        {
          id: "SBI-POL-1001",
          name: "SBI 01",
          distance: "0.5 km",
        },
        {
          id: "ICICI-POL-1002",
          name: "ICICI 02",
          distance: "1.2 km",
        },
        {
          id: "HDFC-POL-1003",
          name: "HDFC 03",
          distance: "2.0 km",
        },
        {
          id: "IOB-POL-1004",
          name: "IOB 04",
          distance: "2.8 km",
        },
      ]
    : [];

  // Get mobile/browser location
  const handleGetLocation = () => {
    setLocationError("");
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setLocationError(
        "Location is not supported by your browser."
      );
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoadingLocation(false);
      },
      () => {
        setLocationError(
          "Please turn ON your mobile location and allow location access."
        );

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // PIN validation
  const handlePin = (e) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) {
      setPinError("Please Add Only Numbers");
    } else {
      setPinError("");
    }

    const numbersOnly = value.replace(/\D/g, "").slice(0, 6);

    setPin(numbersOnly);

    if (
      numbersOnly.length > 0 &&
      numbersOnly.length !== 4 &&
      numbersOnly.length !== 6
    ) {
      setPinError("ATM PIN must contain 4 or 6 digits");
    }

    if (
      numbersOnly.length === 4 ||
      numbersOnly.length === 6
    ) {
      setPinError("");
    }
  };

  // Amount validation
  const handleAmount = (e) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) {
      setAmountError("Please Add Only Numbers");
      setAmount(value.replace(/\D/g, ""));

      // If amount changes, old passcode becomes invalid
      setPasscode("");

      return;
    }

    const numbersOnly = value.replace(/\D/g, "");

    setAmount(numbersOnly);

    // Clear old passcode whenever amount is changed
    setPasscode("");

    if (numbersOnly === "") {
      setAmountError("");
      return;
    }

    const amountValue = Number(numbersOnly);

    if (amountValue < 1000) {
      setAmountError(
        "Minimum withdrawal amount is ₹1,000"
      );
      return;
    }

    if (amountValue > 200000) {
      setAmountError(
        "Maximum withdrawal amount is ₹2,00,000"
      );
      return;
    }

    if (amountValue % 100 !== 0) {
      setAmountError(
        "Amount must be in multiples of ₹100"
      );
      return;
    }

    setAmountError("");
  };

  // Generate 6 digit passcode ONLY when button is clicked
  const handleGeneratePasscode = () => {
    if (!amountValid) {
      return;
    }

    const code = Math.floor(
      100000 + Math.random() * 900000
    );

    setPasscode(code.toString());
  };

  const selectedCard = cards.find(
    (card) => card.id.toString() === selectedCardId
  );

  const pinValid =
    (pin.length === 4 || pin.length === 6) &&
    pinError === "";

  const amountValid =
    amount !== "" &&
    Number(amount) >= 1000 &&
    Number(amount) <= 200000 &&
    Number(amount) % 100 === 0 &&
    amountError === "";

  const allValid =
    selectedCard &&
    pinValid &&
    selectedAtm &&
    amountValid &&
    passcode;

  // Proceed
  const handleProceed = async () => {

  // Check whether another withdrawal is already in process
  const existingTransactions = JSON.parse(
    localStorage.getItem("withdrawalTransactions") || "[]"
  );

  const inprocessWithdrawal = existingTransactions.some(
    (transaction) => transaction.status === "Inprocess"
  );

  // Stop new withdrawal if another transaction is in process
  if (inprocessWithdrawal) {
    alert(
      "A withdrawal is already in process. Please complete the current withdrawal before starting a new one."
    );

    navigate("/transaction-history");
    return;
  }

  // Check all fields
  if (!allValid) {
    return;
  }

  // Check ATM PIN
  if (selectedCard.pin !== pin) {
    setPinError("Incorrect ATM PIN");
    return;
  }

  // Find selected ATM
  const selectedATMDetails = nearbyATMs.find(
    (atm) => atm.id === selectedAtm
  );

  // Create new transaction
  const newTransaction = {
    id: Date.now(),
    bank: selectedCard.bank,
    cardNumber: selectedCard.cardNumber,
    amount: Number(amount),
    atmName: selectedATMDetails.name,
    atmId: selectedATMDetails.id,
    distance: selectedATMDetails.distance,
    passcode: passcode,
    status: "Inprocess",
    date: new Date().toLocaleString(),
  };

  // Add new transaction to existing transactions
  const updatedTransactions = [
    newTransaction,
    ...existingTransactions,
  ];

  // Save transaction
  // Save transaction in customer project
localStorage.setItem(
  "withdrawalTransactions",
  JSON.stringify(updatedTransactions)
);

// Send withdrawal request to ATM backend
console.log("Sending withdrawal to ATM backend...");
try {
  const response = await fetch(
    "http://localhost:5000/api/withdrawal",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bank: selectedCard.bank,
        cardNumber: selectedCard.cardNumber,
        amount: Number(amount),
        atmName: selectedATMDetails.name,
        atmId: selectedATMDetails.id,
        distance: selectedATMDetails.distance,
        passcode: passcode,
        pin: pin,
        status: "Inprocess",
        date: new Date().toLocaleString(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    alert("Unable to connect to ATM server.");
    return;
  }

  alert("Process Successful");

  navigate("/atm-withdrawal");
} catch (error) {
  console.error("Backend Error:", error);

  alert(
    "Withdrawal created, but ATM server is not available."
  );
}
};
  

  return (
    <div className="withdraw-page">

      {/* Header */}
      <header className="withdraw-header">

        <div className="withdraw-header-left">

          <button
            className="withdraw-back-button"
            onClick={() => navigate("/atm-withdrawal")}
          >
            <ArrowLeft size={28} />
          </button>

          <h1>Withdraw Money</h1>

        </div>

        <div className="withdraw-secure">

          <ShieldCheck size={30} />

          <div>
            <strong>100%</strong>
            <span>SECURE</span>
          </div>

        </div>

      </header>

      <main className="withdraw-content">

        <div className="withdraw-container">

          {/* Main Icon */}
          <div className="withdraw-icon">
            <Banknote
              size={55}
              strokeWidth={1.5}
            />
          </div>

          <h2>Withdraw Money</h2>

          <p className="withdraw-description">
            Enter your details to create a secure ATM withdrawal request
          </p>

          {/* 1. Choose Debit Card */}
          <div className="withdraw-form-group">

            <label>
              <CreditCard size={18} />
              Choose Your Debit Card
            </label>

            <select
              value={selectedCardId}
              onChange={(e) => {
                setSelectedCardId(e.target.value);
                setPin("");
                setPinError("");
                setLocation(null);
                setSelectedAtm("");
                setAmount("");
                setAmountError("");
                setPasscode("");
              }}
            >

              <option value="">
                Select Your Debit Card
              </option>

              {cards.map((card) => (
                <option
                  key={card.id}
                  value={card.id}
                >
                  {card.bank} - **** **** ****{" "}
                  {card.cardNumber
                    .replace(/\s/g, "")
                    .slice(-4)}
                </option>
              ))}

            </select>

            {cards.length === 0 && (
              <div className="withdraw-info">
                No debit card found. Please add a debit card first.
              </div>
            )}

          </div>

          {/* 2. ATM PIN */}
          <div className="withdraw-form-group">

            <label>
              <LockKeyhole size={18} />
              Enter Your ATM PIN
            </label>

            <input
              type="password"
              value={pin}
              onChange={handlePin}
              placeholder="Enter 4 or 6 digit ATM PIN"
              maxLength="6"
              inputMode="numeric"
              disabled={!selectedCardId}
            />

            {pinError && (
              <div className="withdraw-field-error">
                {pinError}
              </div>
            )}

          </div>

          {/* 3. Choose Nearby ATM */}
          <div className="withdraw-form-group">

            <label>
              <MapPin size={18} />
              Choose ATM Nearby
            </label>

            <button
              type="button"
              className="location-button"
              onClick={handleGetLocation}
              disabled={!pinValid}
            >

              <MapPin size={20} />

              {loadingLocation
                ? "Getting Your Location..."
                : location
                ? "Location Enabled"
                : "Turn ON Location & Find Nearby ATMs"}

            </button>

            {locationError && (
              <div className="withdraw-field-error">
                {locationError}
              </div>
            )}

            {location &&
              nearbyATMs.length > 0 && (
                <select
                  value={selectedAtm}
                  onChange={(e) => {
                    setSelectedAtm(e.target.value);
                    setAmount("");
                    setAmountError("");
                    setPasscode("");
                  }}
                >

                  <option value="">
                    Select Nearby ATM
                  </option>

                  {nearbyATMs.map((atm) => (
                    <option
                      key={atm.id}
                      value={atm.id}
                    >
                      {atm.name} - {atm.id} - {atm.distance}
                    </option>
                  ))}

                </select>
              )}

          </div>

          {/* 4. Enter Amount */}
          <div className="withdraw-form-group">

            <label>
              <Banknote size={18} />
              Enter Amount To Withdraw
            </label>

            <input
              type="text"
              value={amount}
              onChange={handleAmount}
              placeholder="Enter amount (₹1,000 - ₹2,00,000)"
              inputMode="numeric"
              disabled={!selectedAtm}
            />

            <div className="amount-hint">
              Minimum ₹1,000 | Maximum ₹2,00,000 |
              Multiples of ₹100
            </div>

            {amountError && (
              <div className="withdraw-field-error">
                {amountError}
              </div>
            )}

            {/* Generate Passcode Button */}
            {amountValid && (
              <button
                type="button"
                className="generate-passcode-button"
                onClick={handleGeneratePasscode}
              >
                {passcode
                  ? "Passcode Generated"
                  : "Generate Passcode"}
              </button>
            )}

          </div>

          {/* 5. Generated Passcode */}
          {passcode && (
            <div className="passcode-box">

              <span>
                YOUR 6 DIGIT WITHDRAWAL PASSCODE
              </span>

              <strong>
                {passcode}
              </strong>

              <p>
                Keep this passcode secure for your ATM withdrawal.
              </p>

            </div>
          )}

          {/* 6. Proceed */}
          <button
            type="button"
            className="proceed-withdraw-button"
            disabled={!allValid}
            onClick={handleProceed}
          >
            Proceed to Withdraw Money
          </button>

        </div>

      </main>

    </div>
  );
}

export default WithdrawMoney;