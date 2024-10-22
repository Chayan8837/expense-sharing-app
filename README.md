#  Expense-spliting 

## Getting Started

### Cloning the Repository
Open your terminal and run the following command to clone the repository to your local machine:

```bash
git clone https://github.com/your-username/expense-sharing-app.git
cd expense-sharing-app
```
### install the dependencies
```bash
npm install
```
### run the server 
```
npm run start 
npm run dev
```
app will start running  at http://localhost:5000/api
## file system diagram
```java
/new-expense
├── /controllers
│   ├── expenseController.js  # Logic for handling expenses
│   ├── userController.js     # Logic for handling users
│   ├── balanceController.js   # Logic for handling balances
│   └── download.js            # Logic for handling download requests (e.g., CSV export)
├── /models
│   ├── Expense.js             # Mongoose schema for expenses
│   ├── User.js                # Mongoose schema for users
│   └── Balance.js             # Mongoose schema for balance sheets
├── /routes
│   ├── expenseRoutes.js       # Routes for expense-related endpoints
│   ├── userRoutes.js          # Routes for user-related endpoints
│   └── balanceRoutes.js       # Routes for balance-related endpoints
├── .env                        # Environment variables
├── package.json                # Project metadata and dependencies
└── server.js                   # Main entry point for the server   add this diagram at the top of that md file
```



This API allows users to manage their expenses effectively. Users can register, log in, create expenses, retrieve their balance, download balance sheets, and update expense splits.

## Endpoints

### User Registration
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** This endpoint is used to register a new user.
- **Parameters:**
  - `name` (string): The name of the user.
  - `email` (string): The email address of the user.
  - `phone` (string): The phone number of the user.
  - `password` (string): The password for the user's account.
- **Response:** Confirmation message upon successful registration or an error message if the user already exists.

```javascript
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "johndoe@example.com"
  "password": "password"
}
```



### User Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** This endpoint allows users to authenticate themselves.
- **Parameters:**
  - `email` (string): The email address of the user.
  - `password` (string): The password for the user's account.
- **Response:** A token for authenticated requests upon successful login, or an error message for invalid credentials.

```javascript
{
  "email": "johndoe@example.com"
  "password": "password"
}
```

### Create Expense
- **URL:** `/api/expenses`
- **Method:** `POST`
- **Description:** This endpoint is used to create a new expense.
- **Parameters:**
  - `creator` (string): The ID of the user creating the expense.
  - `description` (string): A description of the expense.
  - `amount` (number): The total amount of the expense.
  - `split_type` (string): The method of splitting the expense (e.g., `none`, `equal`, `exact`, `percentage`). Default is `none`.
  - `split_members` (array): An array of user IDs or objects specifying the split members and their respective amounts or percentages.
- **Response:** Details of the created expense upon success or an error message if input validation fails.

```javascript
{
  "description": "Dinner with friends",
  "amount": 200,
  "creator": "John Doe's ID",
  "split_type": "exact",
  "split_members": [
    { "user": "Jane Smith's ID","amount":100 },//no need amount fow equal
    { "user": "another ID","amount":100 }// and percetage for  percentage
  ]
}

```
### Update Expense Split
- **URL:** `/api/expenses/:expenseId`
- **Method:** `PUT`
- **Description:** This endpoint updates the split details of an existing expense.
- **Parameters:**
  - `split_type` (string): The new method of splitting the expense (e.g., `equal`, `exact`, `percentage`).
  - `split_members` (array): An array of user IDs or objects specifying the new split members and their respective amounts or percentages.
- **Response:** Details of the updated expense upon success or an error message if the provided data is invalid.


```javascript
{
  "split_type": "exact",
  "split_members": [
    { "user": "Jane Smith's ID","amount":100 },//no need amount fow equal
    { "user": "another ID","amount":100 }// and percetage for  percentage
  ]
}

```

 


### Get User Balance
- **URL:** `/api/balance/:userId`
- **Method:** `GET`
- **Description:** This endpoint retrieves the balance details for a specific user.
- **Parameters:**
  - `id` (string): The ID of the user whose balance is to be retrieved.
- **Response:** Balance details including total expenses created, amounts paid, and outstanding balances. Returns an error message if the user ID is not found.





### Download Balance Sheet
- **URL:** `/api/download/:userId`
- **Method:** `GET`
- **Description:** This endpoint allows users to download their balance sheet.(excel)
- **Parameters:**
  - `id` (string): The ID of the user whose balance sheet is to be downloaded.
- **Response:** A downloadable balance sheet file (e.g., Excel) containing the user's expense data and balances. Returns an error message if the user ID is not found.



## Conclusion

The Expense Management API is designed to provide a straightforward interface for users to manage their expenses and balances. By leveraging these endpoints, users can keep track of their spending, settle accounts with friends or family, and maintain a clear overview of their financial activities.
