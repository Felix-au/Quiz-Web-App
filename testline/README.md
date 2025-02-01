# QuizApp

## Project Overview

QuizApp is an interactive quiz platform built using React. It allows users to test their knowledge by answering multiple-choice questions. The app includes a leaderboard, a real-time timer for each question, and a detailed summary of answers with additional reading materials.

## Features

- Fetches quiz questions from an API.
- Supports a timer mechanism for each question.
- Tracks and updates the score dynamically.
- Displays a leaderboard ranking players based on scores.
- Provides detailed explanations and reading materials for each question.
- Uses local storage to retain leaderboard data.
- Plays sound effects for correct and wrong answers.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Feli-au/QuizWebApp.git
   cd quiz-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

### Running the App

Start the development server:

```sh
npm start
```

OR

```sh
yarn start
```

This will start the application at `http://localhost:3000/`.

### API Integration

The app fetches quiz questions from the following API endpoint:

```
https://api.allorigins.win/raw?url=https://api.jsonserve.com/Uw5CrX
```

Ensure that the API is available before running the app.

### File Structure

```
QuizApp/
├── public/
├── src/
│   ├── sounds/        # Sound files for correct/wrong answers
│   ├── App.js         # Main component
│   ├── App.css        # Styling file
│   ├── index.js       # Entry point
├── package.json       # Dependencies and scripts
├── README.md          # Project documentation
```

### Customization

- Modify `App.css` to change the appearance of the quiz.
- Update API URL in `fetchQuizData` function inside `App.js` if a new data source is used.

### Troubleshooting

- **Quiz not loading?** Check API availability.
- **No sound effects?** Ensure that correct.mp3 and wrong.mp3 are properly imported.
- **Leaderboard not updating?** Try clearing local storage and reloading the page.

## Author

Harshit Soni