const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: 'Timur', email: "timur@gmail.com", balance: 300, currency: "EUR", 
    transaction_history: [
      { type: "Transfer", sum: 10, date: "2024-01-11 15:32:03", id: 2 }
    ]
  },
  { id: 2, username: 'Elena', email: "elena@yahoo.com", balance: 450, currency: "USD", 
    transaction_history: [
      { type: "Deposit", sum: 150, date: "2024-01-09 08:15:00", id: 3 }
    ]
  },
  { id: 3, username: 'Ivan', email: "ivan@mail.ru", balance: 120, currency: "EUR", 
    transaction_history: [
      { type: "Withdraw", sum: 20, date: "2024-01-10 10:00:00", id: 4 }
    ]
  },
  { id: 4, username: 'Anna', email: "anna@gmail.com", balance: 700, currency: "GBP", 
    transaction_history: [
      { type: "Transfer", sum: 50, date: "2024-01-11 12:32:03", id: 5 }
    ]
  },
  { id: 5, username: 'Mark', email: "mark@hotmail.com", balance: 220, currency: "USD", 
    transaction_history: [
      { type: "Deposit", sum: 100, date: "2024-01-08 15:45:22", id: 6 }
    ]
  },
  { id: 6, username: 'Olga', email: "olga@mail.com", balance: 340, currency: "EUR", 
    transaction_history: [
      { type: "Withdraw", sum: 40, date: "2024-01-07 09:30:15", id: 7 }
    ]
  },
  { id: 7, username: 'Dmitry', email: "dmitry@mail.ru", balance: 500, currency: "USD", 
    transaction_history: [
      { type: "Transfer", sum: 70, date: "2024-01-06 20:20:00", id: 8 }
    ]
  },
  { id: 8, username: 'Svetlana', email: "svetlana@outlook.com", balance: 560, currency: "EUR", 
    transaction_history: [
      { type: "Deposit", sum: 60, date: "2024-01-05 18:30:11", id: 9 }
    ]
  },
  { id: 9, username: 'Alex', email: "alex@gmail.com", balance: 650, currency: "GBP", 
    transaction_history: [
      { type: "Withdraw", sum: 30, date: "2024-01-04 14:22:45", id: 10 }
    ]
  },
  { id: 10, username: 'Maria', email: "maria@yahoo.com", balance: 1000, currency: "USD", 
    transaction_history: [
      { type: "Deposit", sum: 200, date: "2024-01-03 10:10:10", id: 11 }
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
    return res.status(400).send({ error: 'Invalid user id' });
  }
  res.json(user);
})

app.get("/users/:id/balance", (req, res) => {
  let id = parseInt(req.params.id);
  let user = users.find(user => user.id === id )
  if (!isUserExisting(id, user)){
    return res.status(400).send({ error: 'Invalid user id' });
  }
  res.json(`${user.balance} ${user.currency}`);
});

app.listen(PORT, () => {
  console.log(`Microservice is running`);
});