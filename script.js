document.getElementById("clientForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let product = document.getElementById("product").value.trim();
    let inquiry = document.getElementById("inquiry").value.trim();
    let amount = document.getElementById("amount").value.trim();
    let location = document.getElementById("location").value.trim();

    if (!name || !product || !inquiry || !amount || !location) {
        alert("Please fill in all fields!");
        return;
    }

    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    
    clients.push({
        name: name,
        product: product,
        inquiry: inquiry,
        amount: amount,
        location: location,
        entryDate: new Date().getTime() // Save timestamp
    });

    localStorage.setItem("clients", JSON.stringify(clients));

    alert("Client added successfully!");

    document.getElementById("clientForm").reset();
});

// Function to show/hide the client list
function toggleClientList() {
    let clientList = document.getElementById("clientList");
    
    if (clientList.style.display === "none" || clientList.style.display === "") {
        showDueClients();
        clientList.style.display = "block";
    } else {
        clientList.style.display = "none";
    }
}

// Function to check and show reminders
function showDueClients() {
    let storedData = localStorage.getItem("clients");

    if (!storedData) {
        console.log("No client data found.");
        document.getElementById("reminderList").innerHTML = "<li>No pending clients.</li>";
        return;
    }

    let clients;
    try {
        clients = JSON.parse(storedData) || [];
    } catch (error) {
        console.error("Error parsing JSON. Clearing corrupted data...", error);
        localStorage.removeItem("clients"); // Remove bad data
        document.getElementById("reminderList").innerHTML = "<li>No pending clients.</li>";
        return;
    }

    let now = new Date().getTime();
    let testingMode = 10000; // 10 seconds for testing

    let dueClients = clients.filter(client => 
        client.name && client.product && client.inquiry && client.amount && client.location &&
        client.entryDate && (now - client.entryDate >= testingMode)
    );

    let reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = ""; // Clear previous list

    if (dueClients.length === 0) {
        reminderList.innerHTML = "<li>No pending clients.</li>";
        return;
    }

    dueClients.forEach((client, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${client.name}</strong> - ${client.product}<br>
            📌 ${client.inquiry}<br>
            💰 ₹${client.amount} | 📍 ${client.location} 
            <button class="delete-btn" onclick="deleteClient(${index})">-</button>`;
        reminderList.appendChild(li);
    });
}


// Function to delete a client
function deleteClient(index) {
    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    let now = new Date().getTime();
    let testingMode = 10000; // 10 seconds for testing

    let dueClients = clients.filter(client => 
        client.name && client.product && client.inquiry && client.amount && client.location &&
        client.entryDate && (now - client.entryDate >= testingMode)
    );

    if (dueClients.length > index) {
        let fullIndex = clients.indexOf(dueClients[index]); // Get real index in full list
        clients.splice(fullIndex, 1);
        localStorage.setItem("clients", JSON.stringify(clients));
        showDueClients(); // Refresh list
    }
}

// Auto-check every 10 seconds (for testing)
setInterval(showDueClients, 10000);
