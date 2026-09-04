const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Store the current withdrawal
let currentWithdrawal = null;

// Store completed withdrawals
let withdrawalHistory = [];

/* =========================================
   CUSTOMER -> CREATE WITHDRAWAL
========================================= */
app.post("/api/withdrawal", (req, res) => {
  const {
    bank,
    cardNumber,
    amount,
    atmName,
    atmId,
    distance,
    passcode,
    pin,
    status,
    date,
    transactionId,
  } = req.body;

  if (
    !bank ||
    !cardNumber ||
    !amount ||
    !atmName ||
    !atmId ||
    !passcode ||
    !pin
  ) {
    return res.status(400).json({
      success: false,
      message: "Incomplete withdrawal details.",
    });
  }

  currentWithdrawal = {
    transactionId: transactionId || Date.now(),
    bank,
    cardNumber,
    amount: Number(amount),
    atmName,
    atmId,
    distance,
    passcode: String(passcode),
    pin: String(pin),
    status: status || "Inprocess",
    result: "Pending",
    date: date || new Date().toLocaleString(),
  };

  console.log("New withdrawal created:");
  console.log(currentWithdrawal);

  res.json({
    success: true,
    message: "Withdrawal request saved successfully.",
    withdrawal: currentWithdrawal,
  });
});

/* =========================================
   GET CURRENT WITHDRAWAL
========================================= */
app.get("/api/withdrawal", (req, res) => {
  if (!currentWithdrawal) {
    return res.status(404).json({
      success: false,
      message: "No withdrawal request found.",
    });
  }

  res.json({
    success: true,
    withdrawal: currentWithdrawal,
  });
});

/* =========================================
   ATM -> VALIDATE PASSCODE + PIN
========================================= */
app.post("/api/withdrawal/validate", (req, res) => {
  const { passcode, pin } = req.body;

  if (!currentWithdrawal) {
    return res.status(404).json({
      success: false,
      message: "No withdrawal request found.",
    });
  }

  const passcodeCorrect =
    String(passcode) === String(currentWithdrawal.passcode);

  const pinCorrect =
    String(pin) === String(currentWithdrawal.pin);

  if (!passcodeCorrect || !pinCorrect) {
    return res.json({
      success: false,
      message: "Wrong Passcode or PIN",
    });
  }

  res.json({
    success: true,
    message: "Passcode and PIN verified successfully.",
    withdrawal: currentWithdrawal,
  });
});

/* =========================================
   CUSTOMER -> CHECK WITHDRAWAL STATUS
========================================= */
app.get("/api/withdrawal/status", (req, res) => {
  const { passcode } = req.query;

  console.log("Status request received for passcode:", passcode);

  // Check current withdrawal
  if (
    currentWithdrawal &&
    String(currentWithdrawal.passcode) === String(passcode)
  ) {
    return res.json({
      success: true,
      withdrawal: currentWithdrawal,
    });
  }

  // Check completed withdrawal history
  const completedWithdrawal = withdrawalHistory.find(
    (item) => String(item.passcode) === String(passcode)
  );

  if (completedWithdrawal) {
    return res.json({
      success: true,
      withdrawal: completedWithdrawal,
    });
  }

  return res.status(404).json({
    success: false,
    message: "Withdrawal not found.",
  });
});

/* =========================================
   ATM -> COMPLETE WITHDRAWAL
========================================= */
app.post("/api/withdrawal/complete", (req, res) => {
  if (!currentWithdrawal) {
    return res.status(404).json({
      success: false,
      message: "No withdrawal request found.",
    });
  }

  // Change status
  currentWithdrawal.status = "Completed";
  currentWithdrawal.result = "Successful";

  // Make a copy
  const completedWithdrawal = {
    ...currentWithdrawal,
  };

  // Save in history
  withdrawalHistory.push(completedWithdrawal);

  console.log("Withdrawal completed:");
  console.log(completedWithdrawal);

  // Clear current withdrawal
  currentWithdrawal = null;

  res.json({
    success: true,
    message: "Withdrawal completed successfully.",
    withdrawal: completedWithdrawal,
  });
});

/* =========================================
   START SERVER
========================================= */
app.listen(PORT, () => {
  console.log(`ATM Backend running on http://localhost:${PORT}`);
});