# Sake Recommendation Web

A web application designed to recommend the perfect Sake for your palate.

## MVP Scope & Status

The following is the status of the Minimum Viable Product (MVP) features:

- [x] **Login**: Successfully implemented (Line, Google, Facebook). *Note: Apple login is pending credentials.*
- [ ] **Taste Input**: Not available.
- [x] **Recommendation**: Available via API (currently using mock data for personalization).
- [ ] **Food Pairing**: Not available.
- [ ] **Learning Snippets**: Not available.
- [ ] **Table Mode**: Not available.
- [ ] **Feedback**: Not available.

## Current Features

### 1. Authentication
- Secure login using **NextAuth.js**.
- Supports **Google**, **Facebook**, and **Line**.
- **Guest Mode** for users who want to browse without creating an account.
- **Logout** functionality integrated.

### 2. Product Discovery
- **Personalized Recommendations**: Logged-in users see recommendations tailored to their ID (simulated).
- **Top Recommendations**: Guest users see a curated list of popular sakes.
- **Premium UI**: Glassmorphism design with smooth animations.

## How to Run

### Prerequisites
- Node.js installed.
- `.env.local` file configured in `/client` (see `.env.local.template`).

### Steps
1.  **Start the Backend**:
    ```bash
    cd server
    npm start
    # Running on http://localhost:4000
    ```

2.  **Start the Frontend**:
    ```bash
    cd client
    npm run dev
    # Running on http://localhost:3000
    ```

## Testing

Unit tests are available for both Client and Server.

- **Backend**: `cd server && npm test`
- **Frontend**: `cd client && npm test`