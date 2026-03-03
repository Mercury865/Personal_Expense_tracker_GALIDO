# Expense Tracker

## a. Setup Instructions

1. Install Node.js and MongoDB
2. Start MongoDB
3. Run `node server.js`
4. Open http://localhost:3000

## b. Database Configuration Steps

Default connection: `mongodb://127.0.0.1:27017/expense_tracker`

## c. List of Implemented Features

- Add transactions (income/expense)
- View all transactions
- Edit transactions
- Delete transactions
- Calculate total balance, income, expenses

## d. Additional Features Beyond Minimum Requirements

- Custom categories (depends on the user since custom input)
- Real-time balance updates
- Edit with quick prompts

## e. Known Issues and Limitations

- No user authentication
- No data filtering or search
- No pagination (slow with many transactions)
- No export functionality
- Uses browser prompts for editing (bad UX)
- No undo/redo
- All data shared between users
