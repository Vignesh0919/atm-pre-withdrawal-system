import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import "./AddDebitCard.css";

const banks = [
  "ICICI Bank",
  "HDFC Bank",
  "State Bank of India",
  "KVB",
  "IOB",
  "TMB",
  "AXIS Bank",
  "Kotak Mahindra Bank",
  "Canara Bank",
  "Bank of Baroda",
];

function AddDebitCard() {
  const navigate = useNavigate();

  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({
    cardNumber: "",
    cvv: "",
    expiry: "",
    pin: "",
    name: "",
  });

  // -----------------------------------------
  // CARD NUMBER
  // -----------------------------------------

  const handleCardNumber = (e) => {
    const value = e.target.value;

    if (/[^0-9\s]/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "Please Add Only Numbers",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }));
    }

    const numbersOnly = value.replace(/\D/g, "").slice(0, 16);

    const formatted = numbersOnly
      .replace(/(.{4})/g, "$1 ")
      .trim();

    setCardNumber(formatted);

    if (numbersOnly.length > 0 && numbersOnly.length < 16) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "Card number must contain 16 digits",
      }));
    }

    if (numbersOnly.length === 16) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }));
    }
  };

  // -----------------------------------------
  // CVV
  // -----------------------------------------

  const handleCvv = (e) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        cvv: "Please Add Only Numbers",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        cvv: "",
      }));
    }

    const numbersOnly = value.replace(/\D/g, "").slice(0, 3);

    setCvv(numbersOnly);

    if (numbersOnly.length > 0 && numbersOnly.length < 3) {
      setErrors((prev) => ({
        ...prev,
        cvv: "Enter Your 3 Digit CVV",
      }));
    }

    if (numbersOnly.length === 3) {
      setErrors((prev) => ({
        ...prev,
        cvv: "",
      }));
    }
  };

  // -----------------------------------------
  // EXPIRY DATE
  // -----------------------------------------

  const handleExpiry = (e) => {
    let value = e.target.value;

    if (/[^0-9/]/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        expiry: "Please Add Only Numbers",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        expiry: "",
      }));
    }

    let numbersOnly = value.replace(/\D/g, "").slice(0, 4);

    if (numbersOnly.length >= 3) {
      numbersOnly =
        numbersOnly.substring(0, 2) +
        "/" +
        numbersOnly.substring(2);
    }

    setExpiry(numbersOnly);

    if (numbersOnly.length === 5) {
      const month = parseInt(numbersOnly.substring(0, 2));
      const year = parseInt(numbersOnly.substring(3, 5));

      const currentYear = new Date().getFullYear() % 100;

      if (month < 1 || month > 12) {
        setErrors((prev) => ({
          ...prev,
          expiry: "Enter a valid month between 01 and 12",
        }));
        return;
      }

      if (year < currentYear) {
        setErrors((prev) => ({
          ...prev,
          expiry: "Card expiry year cannot be in the past",
        }));
        return;
      }

      setErrors((prev) => ({
        ...prev,
        expiry: "",
      }));
    } else if (numbersOnly.length > 0) {
      setErrors((prev) => ({
        ...prev,
        expiry: "Enter expiry date as MM/YY",
      }));
    }
  };

  // -----------------------------------------
  // PIN
  // -----------------------------------------

  const handlePin = (e) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        pin: "Please Add Only Numbers",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        pin: "",
      }));
    }

    const numbersOnly = value.replace(/\D/g, "").slice(0, 6);

    setPin(numbersOnly);
  };

  // -----------------------------------------
  // NAME
  // -----------------------------------------

  const handleName = (e) => {
    const value = e.target.value;

    if (/[^a-zA-Z\s]/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Please Add Only Letters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
    }

    const lettersOnly = value
      .replace(/[^a-zA-Z\s]/g, "");

    setName(lettersOnly);
  };

  // -----------------------------------------
  // FIELD ENABLE CONDITIONS
  // -----------------------------------------

  const cardNumberValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    errors.cardNumber === "";

  const cvvValid =
    cvv.length === 3 &&
    errors.cvv === "";

  const expiryValid =
    expiry.length === 5 &&
    errors.expiry === "";

  const pinValid =
    pin.length >= 1 &&
    pin.length <= 6 &&
    errors.pin === "";

  const nameValid =
    name.trim().length > 0 &&
    errors.name === "";

  // -----------------------------------------
  // SAVE
  // -----------------------------------------

  const allFieldsValid =
    bank !== "" &&
    cardNumberValid &&
    cvvValid &&
    expiryValid &&
    pinValid &&
    nameValid;

  const handleSave = () => {
  if (!allFieldsValid) {
    return;
  }

  const newCard = {
    id: Date.now(),
    bank,
    cardNumber,
    cvv,
    expiry,
    pin,
    name,
  };

  // Get previously saved cards
  const existingCards = JSON.parse(
    localStorage.getItem("savedDebitCards") || "[]"
  );

  // Add new card
  const updatedCards = [
    ...existingCards,
    newCard,
  ];

  // Save all cards
  localStorage.setItem(
    "savedDebitCards",
    JSON.stringify(updatedCards)
  );

  alert("Card Saved Successfully");

  navigate("/atm-withdrawal");
};

  return (
    <div className="add-card-page">

      {/* HEADER */}

      <header className="add-card-header">

        <div className="add-card-header-left">

          <button
            className="add-card-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={28} />
          </button>

          <h1>Add Your Debit Card Details</h1>

        </div>

        <div className="add-card-secure">

          <ShieldCheck size={32} />

          <div>
            <strong>100%</strong>
            <span>SECURE</span>
          </div>

        </div>

      </header>


      {/* CONTENT */}

      <main className="add-card-content">

        <div className="add-card-container">

          <div className="add-card-icon">
            <CreditCard
              size={55}
              strokeWidth={1.6}
            />
          </div>

          <h2>Enter Your Debit Card Details</h2>

          <p className="add-card-description">
            Please enter your card details securely
          </p>


          {/* BANK */}

          <div className="form-group">

            <label>
              Select Your Bank
            </label>

            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              <option value="">
                Select Your Bank
              </option>

              {banks.map((bankName) => (
                <option
                  key={bankName}
                  value={bankName}
                >
                  {bankName}
                </option>
              ))}
            </select>

          </div>


          {/* CARD NUMBER */}

          <div className="form-group">

            <label>
              Enter Your Card Number
            </label>

            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumber}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength="19"
              disabled={!bank}
              inputMode="numeric"
            />

            {errors.cardNumber && (
              <div className="field-error">
                {errors.cardNumber}
              </div>
            )}

          </div>


          {/* CVV */}

          <div className="form-group">

            <label>
              Enter Your CVV
            </label>

            <input
              type="password"
              value={cvv}
              onChange={handleCvv}
              placeholder="Enter 3 digit CVV"
              maxLength="3"
              disabled={!cardNumberValid}
              inputMode="numeric"
            />

            {errors.cvv && (
              <div className="field-error">
                {errors.cvv}
              </div>
            )}

          </div>


          {/* EXPIRY */}

          <div className="form-group">

            <label>
              Enter Your Card Expiry Date
            </label>

            <input
              type="text"
              value={expiry}
              onChange={handleExpiry}
              placeholder="MM/YY"
              maxLength="5"
              disabled={!cvvValid}
              inputMode="numeric"
            />

            {errors.expiry && (
              <div className="field-error">
                {errors.expiry}
              </div>
            )}

          </div>


          {/* PIN */}

          <div className="form-group">

            <label>
              Enter Your Card PIN
            </label>

            <input
              type="password"
              value={pin}
              onChange={handlePin}
              placeholder="Enter PIN"
              maxLength="6"
              disabled={!expiryValid}
              inputMode="numeric"
            />

            {errors.pin && (
              <div className="field-error">
                {errors.pin}
              </div>
            )}

          </div>


          {/* NAME */}

          <div className="form-group">

            <label>
              Enter Your Name
            </label>

            <input
              type="text"
              value={name}
              onChange={handleName}
              placeholder="Enter name as on card"
              disabled={!pinValid}
            />

            {errors.name && (
              <div className="field-error">
                {errors.name}
              </div>
            )}

          </div>


          {/* SAVE */}

          <button
            className="save-card-button"
            disabled={!allFieldsValid}
            onClick={handleSave}
          >
            Save
          </button>

        </div>

      </main>

    </div>
  );
}

export default AddDebitCard;