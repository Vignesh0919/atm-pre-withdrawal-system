import "./RechargeSection.css";

import {
  Smartphone,
  Lightbulb,
  CreditCard,
  SatelliteDish,
  IndianRupee,
  Grid2X2
} from "lucide-react";

function RechargeSection() {
  return (
    <div className="recharge-section">

      <h2>Recharges & Bill Payments</h2>

      <div className="products">

        {/* Mobile Recharge */}
        <div className="product">
          <div className="icon mobile-icon">
            <Smartphone size={48} strokeWidth={1.7} />
          </div>

          <div className="product-name">
            Mobile
            <br />
            Recharge/Bill
          </div>
        </div>


        {/* Electricity Bill */}
        <div className="product">
          <div className="icon electricity-icon">
            <Lightbulb size={48} strokeWidth={1.7} />
          </div>

          <div className="product-name">
            Electricity
            <br />
            Bill
          </div>
        </div>


        {/* FASTag */}
        <div className="product">
          <div className="icon fastag-icon">
            <CreditCard size={50} strokeWidth={1.7} />
          </div>

          <div className="product-name">
            FASTag
            <br />
            Recharge
          </div>
        </div>


        {/* DTH */}
        <div className="product">
          <div className="icon dth-icon">
            <SatelliteDish size={50} strokeWidth={1.7} />
          </div>

          <div className="product-name">
            DTH
            <br />
            Recharge
          </div>
        </div>


        {/* ATM Withdrawal */}
        <div
          className="product"
          onClick={() => {
            window.location.href = "/atm-withdrawal";
          }}
        >
          <div className="icon atm-money-icon">
            <IndianRupee size={48} strokeWidth={1.7} />
          </div>

          <div className="product-name">
            ATM
            <br />
            Withdrawal
          </div>
        </div>


        {/* View All */}
        <div className="product">
          <div className="icon view-icon">
            <Grid2X2 size={48} strokeWidth={1.7} />
          </div>

          <div className="product-name">
            View All
            <br />
            Products
          </div>
        </div>

      </div>

    </div>
  );
}

export default RechargeSection;