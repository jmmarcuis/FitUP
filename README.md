# FitUP

This project is a workout management application that allows clients and coaches to communicate in real-time through a chat interface. It includes an end-to-end messaging service, secure authentication, an intuitive frontend built with React, and personalized workout management.

## Features

- **Real-time Messaging**: Clients and coaches can exchange messages in real-time.
- **User Authentication**: Secure login for clients and coaches with JWT-based token authentication.
- **Role-based Access**: Only authorized users can send and view messages in specific collaborations.
- **Workout Management**: Clients can see their own workout routines and progress.
- **Collaborative Editing**: Coaches can modify client workouts to optimize routines and track progress directly within the app.

## Tech Stack

- **Frontend**: React, TypeScript, SCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Token (JWT)
- **API Testing**: Postman

## Installation Guide

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/jmmarcuis/FitUP.git
cd FitUP
```
### 2. Install Backend Dependencies
Navigate to the backend directory of the project and install the required backend dependencies:

```bash
cd "Exercise App Backend"
npm install
```

### 3. Install Frontend Dependencies
Navigate to the client and coach directory and install the frontend dependencies:

```bash
cd "Exercise App"
npm install
cd..
cd "Exercise Coach App"
npm install 
```

### 4. Run the project
Head to the three folders and run each project in Powershell or Bash

```bash
npm run dev
```


