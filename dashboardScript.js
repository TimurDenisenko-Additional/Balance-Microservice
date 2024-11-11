document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    const baseUrl = "http://localhost";

    if (!userId) {
        document.body.innerHTML = "<h1>User ID not provided in the URL.</h1>";
        return;
    }

    fetch(`${baseUrl}/users/${userId}`)
        .then(response => {
            if (!response.ok) throw new Error("User not found");
            return response.json();
        })
        .then(user => {
            document.getElementById("username").textContent = user.username;
            document.getElementById("email").textContent = user.email;
            document.getElementById("balance").textContent = `${user.balance} ${user.currency}`;

            return fetch(`${baseUrl}/users/${userId}/transactions`);
        })
        .then(response => response.json())
        .then(transactions => {
            const transactionsList = document.getElementById("transactions");
            transactions.forEach(transaction => {
                const li = document.createElement("li");

                if (transaction.type === "Transfer") {
                    fetch(`${baseUrl}/users/${transaction.id}`)
                        .then(response => response.json())
                        .then(recipient => {
                            li.innerHTML = `
                                <div><strong>${transaction.type}</strong></div>
                                <div>Recipient: ${recipient.username} | #${recipient.id}</div>
                                <div>Amount: ${transaction.sum < 0 ? '' : '+'}${transaction.sum}</div>
                                <div>${transaction.date}</div>
                            `;
                            transactionsList.appendChild(li);
                        })
                        .catch(() => {
                            li.innerHTML = `
                                <div><strong>${transaction.type}</strong></div>
                                <div>Recipient: Unknown | #${transaction.id}</div>
                                <div>Amount: ${transaction.sum < 0 ? '' : '+'}${transaction.sum}</div>
                                <div>${transaction.date}</div>
                            `;
                            transactionsList.appendChild(li);
                        });
                } else {
                    li.innerHTML = `
                        <div><strong>${transaction.type}</strong></div>
                        <div>Amount: ${transaction.sum < 0 ? '' : '+'}${transaction.sum}</div>
                        <div>${transaction.date}</div>
                    `;
                    transactionsList.appendChild(li);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.body.innerHTML = `<h1>${error.message}</h1>`;
        });
});
