# ATM Pre-Withdrawal & Mobile-Based Cash Withdrawal System

A full-stack prototype designed to reduce ATM interaction time and improve customer convenience by allowing users to prepare their cash withdrawal request through a mobile/web application before reaching the ATM.

---

## 📌 Project Overview

Traditional ATM transactions require customers to perform multiple operations directly at the ATM, which can increase transaction time and contribute to longer queues.

This project introduces a **mobile-based ATM pre-withdrawal workflow**.

The customer can prepare the withdrawal request before reaching the ATM by selecting:

- Debit card
- Withdrawal amount
- Preferred ATM
- PIN
- Withdrawal request

The system then generates a unique **6-digit passcode**.

At the ATM, the customer enters the generated passcode and ATM PIN. The ATM application retrieves the pre-created withdrawal request through REST APIs, validates the credentials and proceeds with the withdrawal.

The objective is to reduce the time spent performing operations at the ATM and improve queue throughput.

---

## 🎯 Problem Statement

Customers waiting in ATM queues may spend considerable time performing multiple steps such as selecting the withdrawal amount, entering authentication information and waiting for transaction processing.

This can increase the time required for each customer and result in longer queues.

The goal of this project is to shift most of the preparation work from the ATM to the customer's mobile/web application.

---

## 💡 Proposed Solution

The system consists of two separate applications:

### 1. Customer Application

The customer uses the web/mobile application to:

- Register/login
- Manage debit cards
- Select withdrawal amount
- Select a nearby/preferred ATM
- Validate PIN
- Generate a 6-digit passcode
- Create a withdrawal request
- View transaction status

### 2. ATM Machine Application

The ATM application allows the customer to:

- Enter the 6-digit passcode
- Enter ATM PIN
- Authenticate the withdrawal request
- View withdrawal details
- Confirm withdrawal
- Process cash dispensing
- Complete the transaction

---

## 🏗️ System Architecture

```text
                  CUSTOMER
                     │
                     ▼
          ┌─────────────────────┐
          │   Customer Web App  │
          │      React JS       │
          └──────────┬──────────┘
                     │
                     │ REST API
                     ▼
          ┌─────────────────────┐
          │   Node.js Backend   │
          │      Express.js     │
          └──────────┬──────────┘
                     │
                     │ REST API
                     ▼
          ┌─────────────────────┐
          │    ATM Machine App  │
          │      React JS       │
          └──────────┬──────────┘
                     │
                     ▼
             Authentication
             Passcode + PIN
                     │
                     ▼
              Cash Withdrawal
                     │
                     ▼
          Transaction Completed

🔄 Withdrawal Workflow
Customer opens application
          ↓
Selects debit card
          ↓
Selects withdrawal amount
          ↓
Selects preferred ATM
          ↓
Enters ATM PIN
          ↓
Generates 6-digit passcode
          ↓
Withdrawal Request = Inprocess
          ↓
Customer reaches ATM
          ↓
Enters Passcode + PIN
          ↓
ATM validates request
          ↓
Displays withdrawal details
          ↓
Confirms withdrawal
          ↓
Cash dispensing
          ↓
Transaction = Completed
          ↓
Result = Successful
🚀 Key Features
Customer Application
Debit card management
Withdrawal amount selection
ATM selection
PIN validation
6-digit passcode generation
Withdrawal request creation
Transaction history
Transaction status tracking
Prevention of multiple simultaneous withdrawal requests
ATM Application
ATM welcome screen
Passcode authentication
PIN authentication
Withdrawal details display
Withdrawal confirmation
Cash dispensing workflow
Successful transaction screen
Backend
REST API communication
Withdrawal request creation
Passcode and PIN validation
Withdrawal status management
Withdrawal completion
Communication between Customer and ATM applications
🔐 Authentication Flow

The customer receives a unique 6-digit passcode after creating the withdrawal request.

At the ATM:

        6-Digit Passcode
                +
             ATM PIN
                ↓
        Authentication
                ↓
       Withdrawal Details
                ↓
        Confirm Withdrawal
                ↓
          Cash Dispensing

The ATM retrieves the pre-created withdrawal request from the backend rather than creating a new withdrawal request.

📊 Transaction Lifecycle

The withdrawal request follows a defined transaction lifecycle:

             Inprocess
                 ↓
             Completed
                 ↓
             Successful

Only one withdrawal request can remain in the Inprocess state at a time.

After the withdrawal is successfully completed, the transaction history is updated and the customer can initiate another withdrawal.

💵 Cash Dispensing Workflow

The ATM application supports a staged cash-dispensing workflow.

For example, a ₹100,000 withdrawal can be processed as:

₹100,000

₹25,000 → In Process → Completed
₹25,000 → In Process → Completed
₹25,000 → In Process → Completed
₹25,000 → In Process → Completed

              ↓

     Transaction Completed
              ↓
           Successful

This simulates the stages involved in ATM cash dispensing.

🛠️ Technologies Used
Frontend
React JS
JavaScript
HTML5
CSS3
Vite
Lucide React

Backend
Node.js
Express.js
REST APIs
CORS

Development Tools
Visual Studio Code
Git
GitHub
PowerShell

🧪 Project Demonstration

The complete demonstration follows this sequence:

Customer Application
        ↓
Create Withdrawal Request
        ↓
Generate Passcode
        ↓
Backend API
        ↓
ATM Machine Application
        ↓
Enter Passcode + PIN
        ↓
Validate Request
        ↓
Display Withdrawal Details
        ↓
Confirm Withdrawal
        ↓
Cash Dispensing
        ↓
Transaction Completed
        ↓
Transaction Successful

⏱️ Faster ATM Experience

The project is designed to enable a faster ATM interaction because most withdrawal preparation is completed before the customer reaches the ATM.

Instead of spending several minutes performing all operations at the ATM, the customer arrives with a pre-created withdrawal request.

The final ATM interaction consists primarily of:

Passcode
   +
PIN
   ↓
Authentication
   ↓
Confirm Withdrawal
   ↓
Cash

The actual completion time depends on ATM hardware, network connectivity, authentication and cash-dispensing speed.

## 📸 Project Screenshots

### 📱 Customer Application

#### Customer Dashboard

![Customer Dashboard](screenshots/customer-home.png)

#### Debit Card Management

![Debit Card Management](screenshots/debit-card.png)

#### Withdraw Money

![Withdraw Money](screenshots/withdraw-money.png)

#### ATM Selection

![ATM Selection](screenshots/atm-selection.png)

#### Transaction History

![Transaction History](screenshots/transaction-history.png)

---

### 🏧 ATM Machine Application

#### ATM Welcome Screen

![ATM Welcome Screen](screenshots/atm-welcome.png)

#### Passcode & PIN Authentication

![ATM Authentication](screenshots/atm-authentication.png)

#### Withdrawal Details

![Withdrawal Details](screenshots/atm-withdrawal-details.png)

#### Cash Dispensing

![Cash Dispensing](screenshots/atm-cash-dispensing.png)

#### Transaction Successful

![Transaction Successful](screenshots/atm-success.png)

Please Check screenshots folder for APP screenshot images.
