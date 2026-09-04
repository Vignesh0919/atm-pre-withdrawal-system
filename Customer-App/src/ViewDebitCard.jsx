import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import "./ViewDebitCard.css";


function ViewDebitCard() {

  const navigate = useNavigate();

  const [cards, setCards] = useState([]);


  // -----------------------------------------
  // LOAD SAVED CARDS
  // -----------------------------------------

  useEffect(() => {

    const savedCards = JSON.parse(
      localStorage.getItem("savedDebitCards") || "[]"
    );

    setCards(savedCards);

  }, []);


  // -----------------------------------------
  // DELETE CARD
  // -----------------------------------------

  const handleDelete = (cardId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this card?"
    );

    if (!confirmDelete) {
      return;
    }


    const updatedCards = cards.filter(
      (card) => card.id !== cardId
    );


    setCards(updatedCards);


    localStorage.setItem(
      "savedDebitCards",
      JSON.stringify(updatedCards)
    );

  };


  return (

    <div className="view-card-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="view-card-header">

        <div className="view-card-header-left">

          <button
            className="view-card-back"
            onClick={() =>
              navigate("/atm-withdrawal")
            }
          >
            <ArrowLeft size={26} />
          </button>


          <h1>
            View Your Debit Card
          </h1>

        </div>


        <div className="view-card-secure">

          <ShieldCheck size={30} />

          <div>

            <strong>
              100%
            </strong>

            <span>
              SECURE
            </span>

          </div>

        </div>

      </header>


      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="view-card-content">


        {cards.length === 0 ? (

          /* NO CARD */

          <div className="no-card">

            <CreditCard
              size={55}
              strokeWidth={1.5}
            />

            <h2>
              No Debit Card Added
            </h2>

            <p>
              Please add your debit card first.
            </p>


            <button
              onClick={() =>
                navigate("/add-debit-card")
              }
            >
              Add Your Debit Card
            </button>

          </div>

        ) : (

          /* SAVED CARDS */

          <div className="cards-wrapper">


            <div className="cards-title">

              <h2>
                Your Debit Cards
              </h2>

              <span>
                {cards.length}{" "}
                {cards.length === 1
                  ? "Card"
                  : "Cards"}
              </span>

            </div>


            <div className="cards-list">


              {cards.map((card) => (

                <div
                  className="saved-card-item"
                  key={card.id}
                >


                  {/* DELETE BUTTON */}

                  <button
                    className="delete-card-button"
                    onClick={() =>
                      handleDelete(card.id)
                    }
                    title="Delete Card"
                  >
                    <Trash2 size={19} />
                  </button>


                  {/* BANK */}

                  <div className="saved-bank-name">
                    {card.bank}
                  </div>


                  {/* DEBIT CARD */}

                  <div className="debit-card">


                    {/* CARD TOP */}

                    <div className="card-top">

                      <span>
                        DEBIT CARD
                      </span>

                      <CreditCard
                        size={27}
                        strokeWidth={1.5}
                      />

                    </div>


                    {/* CHIP */}

                    <div className="chip">
                    </div>


                    {/* CARD NUMBER */}

                    <div className="card-number">

                      **** **** ****{" "}

                      {card.cardNumber
                        .replace(/\s/g, "")
                        .slice(-4)}

                    </div>


                    {/* CARD BOTTOM */}

                    <div className="card-bottom">


                      <div>

                        <span>
                          VALID THRU
                        </span>

                        <strong>
                          **/**
                        </strong>

                      </div>


                      <div>

                        <span>
                          CARD HOLDER
                        </span>

                        <strong>
                          {card.name.toUpperCase()}
                        </strong>

                      </div>


                    </div>

                  </div>


                  {/* CARD INFORMATION */}

                  <div className="card-information">


                    <div>

                      <span>
                        Bank
                      </span>

                      <strong>
                        {card.bank}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Card Number
                      </span>

                      <strong>
                        **** **** ****{" "}
                        {card.cardNumber
                          .replace(/\s/g, "")
                          .slice(-4)}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Expiry Date
                      </span>

                      <strong>
                        **/**
                      </strong>

                    </div>


                    <div>

                      <span>
                        Card Holder
                      </span>

                      <strong>
                        {card.name}
                      </strong>

                    </div>


                  </div>


                </div>

              ))}


            </div>


            {/* ADD ANOTHER CARD */}

            <button
              className="add-another-card"
              onClick={() =>
                navigate("/add-debit-card")
              }
            >

              <CreditCard size={21} />

              Add Another Debit Card

            </button>


          </div>

        )}

      </main>

    </div>

  );

}


export default ViewDebitCard;