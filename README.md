# Sixty — Web Platform

> Commercial web application for Sixty's English learning platform.

The **Sixty Web Platform** is the commercial-facing application responsible for presenting the product, managing user access, and orchestrating the purchase experience.
It serves as the entry point for users who want to learn more about Sixty, create an account, authenticate, and purchase a plan.
After completing a purchase, the user is redirected to the **Sixty Platform**, a separate application responsible for the actual learning experience.
The two systems are intentionally decoupled and communicate through well-defined APIs.

## Architecture
The project is part of a distributed application architecture composed of independent systems.

                         ┌─────────────────────────┐
                         │       SIxty Web         │
                         │     Next.js 15          │
                         │                         │
                         │  Landing Page           │
                         │  Authentication         │
                         │  Checkout               │
                         │  Account                │
                         └────────────┬────────────┘
                                      │
                              External APIs
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
              Accounts API       Stripe API       Mercado Pago
                    │
                    │
                    ▼
             ┌─────────────────┐
             │ Sixty Platform  │
             │      .app       │
             │                 │
             │ Learning System │
             │ Courses         │
             │ Lessons         │
             │ Progress        │
             │ Student Area    │
             └─────────────────┘

### Responsibilities

#### Web Application

The Next.js application is responsible for:

* Product presentation
* Marketing and conversion
* User registration
* Authentication
* Account access
* Checkout orchestration
* Payment provider integration
* Payment confirmation
* Newsletter subscription
* Communication with external account services

#### Learning Platform

The learning platform is intentionally separated from this repository.
It is responsible for:
* Courses
* Lessons
* Student experience
* Learning progress
* Educational content
* Platform-specific features

This separation allows the commercial application and the learning environment to evolve independently.

## Core Flows

### User acquisition

Visitor
   │
   ▼
Landing Page
   │
   ├── Product information
   ├── Features
   ├── Plans
   └── CTA
        │
        ▼
     Account
        │
        ▼
     Checkout

### Purchase flow

User
 │
 ▼
Checkout
 │
 ├───────────────┐
 │               │
 ▼               ▼
Stripe       Mercado Pago
 │               │
 └───────┬───────┘
         │
         ▼
   Payment Webhook
         │
         ▼
 Payment Processing
         │
         ▼
 External Accounts API
         │
         ▼
 Account / Access Update
         │
         ▼
 Sixty Platform

Payment confirmation is handled asynchronously through provider webhooks rather than relying exclusively on the client-side checkout response.

---

## Features

### Landing Page

The application provides the commercial presentation of Sixty, including:

* Hero section
* Product explanation
* Platform features
* Learning methodology
* Pricing
* Calls to action
* FAQ
* Newsletter
* Footer navigation

### Authentication

Users can:

* Create an account
* Sign in
* Access their account
* Continue through the purchase flow using their authenticated identity

Authentication is designed as an application-level concern and communicates with the external account infrastructure.

### Payments

The application integrates multiple payment providers.

#### Stripe

Supports:

* One-time payments
* Subscription checkout
* Payment confirmation
* Webhook processing
* Subscription events

#### Mercado Pago

Supports:

* Checkout creation
* Payment processing
* Webhook integration
* Payment confirmation

### Account Synchronization

Payment events can trigger synchronization with the external account system.

This allows the application to keep commercial state and account access coordinated without coupling the learning platform directly to the payment providers.

### Newsletter

Newsletter subscriptions are proxied through an external API, keeping provider-specific communication on the server side.

---

## Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS

### Backend / Application Layer

* Next.js Route Handlers
* Server Actions
* PostgreSQL
* `pg`
* Axios

### Authentication & Identity

* NextAuth
* Firebase Admin
* External Accounts API

### Payments

* Stripe
* Mercado Pago

### Communication

* Resend

### Infrastructure

* Environment-based configuration
* External APIs
* Independent application deployment

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── stripe/
│   │   ├── mercado-pago/
│   │   ├── payments/
│   │   └── newsletter/
│   │
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── hero/
│   │   ├── pricing/
│   │   └── ...
│   │
│   ├── context/
│   ├── ...
│   └── page.tsx
│
├── actions/
│   └── ...
│
├── components/
│   └── ...
│
├── hooks/
│   └── ...
│
├── lib/
│   ├── stripe.ts
│   ├── mercado-pago.ts
│   ├── db.ts
│   ├── resend.ts
│   └── ...
│
└── server/
    ├── stripe/
    ├── utils/
    └── ...
```

The project separates presentation, application actions, integrations, and server-side business logic to avoid coupling the UI directly to external services.

---

## Integrations

### Stripe

Stripe is responsible for payment processing and subscription billing.

Relevant modules include:

```text
src/lib/stripe.ts

src/app/api/stripe/
├── create-pay-checkout/
├── create-subscription-checkout/
└── webhook/

src/server/stripe/
└── handle-payment.ts
```

### Mercado Pago

```text
src/lib/mercado-pago.ts

src/app/api/mercado-pago/
└── create-checkout/
```

### Accounts API

The Accounts API acts as the external identity and account infrastructure consumed by the web application.

```text
NEXT_PUBLIC_ACCOUNTS_API_BASE_URL
```

Communication includes account creation, payment confirmation, upgrades and synchronization.

### Resend

Used for transactional and communication-related email flows.

```text
src/lib/resend.ts
```

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available locally at:

```text
http://localhost:3000
```

---

## Engineering Principles
The project is built around a few architectural principles:

### Separation of concerns
UI components should not contain payment-provider or infrastructure logic.

### Server-side integration
Secrets and provider credentials remain exclusively on the server.

### External service boundaries
The commercial application communicates with external systems through explicit API boundaries instead of directly coupling itself to the learning platform.

### Event-driven payment confirmation
Payment state should be derived from trusted provider events whenever possible, with webhook processing handling asynchronous payment lifecycle events.

### Idempotency
Payment and webhook flows should be designed to safely handle retries and duplicated events.

### Type safety
TypeScript is used across the application to reduce runtime errors and make contracts between layers explicit.

---

## Security

The application follows a server-first approach for sensitive operations.

Sensitive credentials such as:
* Stripe secret keys
* Mercado Pago access tokens
* Database credentials
* Firebase credentials
* Webhook secrets
* Email provider credentials

must never be exposed to the browser.

Client-side environment variables are restricted to values that are explicitly safe to expose.

---

## Repository Status

This repository is actively being restructured.

The current objective is to evolve the application toward a more maintainable architecture with stronger separation of responsibilities, clearer domain boundaries, safer payment flows and production-oriented engineering practices.

---

## License

Copyright © 2026 Eric Romero. All rights reserved.

This project is proprietary.

Unauthorized copying, modification, distribution, reproduction, or use of this source code or substantial portions of it is prohibited without explicit permission from the copyright holder.
