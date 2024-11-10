const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const users = [
  { id: 1, username: 'Timur', email: "timur@gmail.com", balance: 300, currency: "EUR", 
    transaction_history: [
      { type: "Transfer", sum: 10, date: "2024-01-11 15:32:03", id: 2 }
    ]
  },
  { id: 2, username: 'Elena', email: "elena@yahoo.com", balance: 450, currency: "USD", 
    transaction_history: [
      { type: "Deposit", sum: 150, date: "2024-01-09 08:15:00" }
    ]
  },
  { id: 3, username: 'Ivan', email: "ivan@mail.ru", balance: 120, currency: "EUR", 
    transaction_history: [
      { type: "Withdraw", sum: 20, date: "2024-01-10 10:00:00" }
    ]
  },
  { id: 4, username: 'Anna', email: "anna@gmail.com", balance: 700, currency: "GBP", 
    transaction_history: [
      { type: "Transfer", sum: 50, date: "2024-01-11 12:32:03", id: 5 }
    ]
  },
  { id: 5, username: 'Mark', email: "mark@hotmail.com", balance: 220, currency: "USD", 
    transaction_history: [
      { type: "Deposit", sum: 100, date: "2024-01-08 15:45:22" }
    ]
  },
  { id: 6, username: 'Olga', email: "olga@mail.com", balance: 340, currency: "EUR", 
    transaction_history: [
      { type: "Withdraw", sum: 40, date: "2024-01-07 09:30:15" }
    ]
  },
  { id: 7, username: 'Dmitry', email: "dmitry@mail.ru", balance: 500, currency: "USD", 
    transaction_history: [
      { type: "Transfer", sum: 70, date: "2024-01-06 20:20:00", id: 8 }
    ]
  },
  { id: 8, username: 'Svetlana', email: "svetlana@outlook.com", balance: 560, currency: "EUR", 
    transaction_history: [
      { type: "Deposit", sum: 60, date: "2024-01-05 18:30:11" }
    ]
  },
  { id: 9, username: 'Alex', email: "alex@gmail.com", balance: 650, currency: "GBP", 
    transaction_history: [
      { type: "Withdraw", sum: 30, date: "2024-01-04 14:22:45" }
    ]
  },
  { id: 10, username: 'Maria', email: "maria@yahoo.com", balance: 1000, currency: "USD", 
    transaction_history: [
      { type: "Deposit", sum: 200, date: "2024-01-03 10:10:10" }
    ]
  }
]

function isUserExisting(id, user) {
  return !isNaN(id) && user !== undefined;
} 

app.use(express.json());

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let user = users.find(user => user.id === id )
  if (!isUserExisting(id, user)){
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
})

app.get("/users/:id/balance", (req, res) => {
  let id = parseInt(req.params.id);
  let user = users.find(user => user.id === id )
  if (!isUserExisting(id, user)){
    return res.status(404).json({ error: "User not found" });
  }
  res.json(`${user.balance} ${user.currency}`);
});

app.get("/users/:id/transactions", (req, res) => {
  let id = parseInt(req.params.id);
  let user = users.find(user => user.id === id )
  if (!isUserExisting(id, user)){
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user.transaction_history);
});

app.post('/users', (req, res) => {
  const { username, email, balance, currency } = req.body;
  if (!username || !email || isNaN(balance) || !currency) {
    return res.status(400).json({ error: "All fields are required"});
  }
  const newUser = {
    id: ++users.length,
    username,
    email,
    balance,
    currency,
    transaction_history: []
  };
  users.push(newUser);
  res.status(201).json({ message: "User created successfully", user: newUser });
});

app.post('/users/:id/withdraw', (req, res) => {
  let id = parseInt(req.params.id);
  const { amount } = req.body;
  const user = users.find(user => user.id === id);
  if (!isUserExisting(id, user)) {
    return res.status(404).json({ error: "User not found" });
  }
  if (user.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  user.balance -= amount;
  user.transaction_history.push({ type: "Withdraw", sum: amount, date: new Date() });
  res.json({ message: "Withdrawal successful", user });
});

app.post('/users/:id/deposit', (req, res) => {
  let id = parseInt(req.params.id);
  const { amount } = req.body;
  const user = users.find(user => user.id === id);
  if (!isUserExisting(id, user)) {
    return res.status(404).json({ error: "User not found" });
  }
  user.balance += amount;
  user.transaction_history.push({ type: "Deposit", sum: amount, date: new Date() });
  res.json({ message: "Deposit successful", user });
});

app.post('/users/:id/transfer', (req, res) => {
  const senderId = parseInt(req.params.id);
  const { recipientId, amount } = req.body;
  const sender = users.find(user => user.id === senderId);
  const recipient = users.find(user => user.id === recipientId);
  if (!isUserExisting(senderId, sender)) {
    return res.status(404).json({ error: "Sender not found" });
  }
  if (!isUserExisting(recipientId, recipient)) {
    return res.status(404).json({ error: "Recipient not found" });
  }
  if (sender.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  sender.balance -= amount;
  recipient.balance += amount;
  const transactionDate = new Date();
  sender.transaction_history.push({ type: "Transfer", sum: -amount, date: transactionDate, id: recipientId });
  recipient.transaction_history.push({ type: "Transfer", sum: amount, date: transactionDate, id: senderId });
  res.json({ message: "Transfer successful", sender, recipient });
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { username, email, balance, currency } = req.body;
  const user = users.find(user => user.id === id);
  if (!isUserExisting(id, user)) {
    return res.status(404).json({ error: "User not found" });
  }
  if (username) user.username = username;
  if (email) user.email = email;
  if (!isNaN(balance)) user.balance = balance;
  if (currency) user.currency = currency;
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users.splice(userIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Microservice is running`);
});