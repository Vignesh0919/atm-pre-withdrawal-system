import { BrowserRouter, Routes, Route } from "react-router-dom";

import RechargeSection from "./RechargeSection";
import ATMWithdrawal from "./ATMWithdrawal";
import AddDebitCard from "./AddDebitCard";
import ViewDebitCard from "./ViewDebitCard";
import WithdrawMoney from "./WithdrawMoney";
import TransactionHistory from "./TransactionHistory";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={<RechargeSection />}
        />

        {/* ATM Withdrawal Page */}
        <Route
          path="/atm-withdrawal"
          element={<ATMWithdrawal />}
        />
        <Route
  path="/add-debit-card"
  element={<AddDebitCard />}
/>
<Route
  path="/view-debit-card"
  element={<ViewDebitCard />}
/>
<Route 
path="/withdraw-money" 
element={<WithdrawMoney />} 
/>
<Route
  path="/transaction-history"
  element={<TransactionHistory />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;