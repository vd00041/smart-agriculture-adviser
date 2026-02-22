function sendMessage() {
    let input = document.getElementById("userInput");
    let msg = input.value.toLowerCase();
    let chat = document.getElementById("chat-area");

    if (msg === "") return;

    chat.innerHTML += "<p><b>You:</b> " + msg + "</p>";

    let reply = "";

    if (msg.includes("crop")) {
        reply = "Tell me your soil type and season 🌾";
    }
    else if (msg.includes("wheat")) {
        reply = "Wheat grows well in loamy soil during rabi season.";
    }
    else if (msg.includes("rice")) {
        reply = "Rice requires clay soil and sufficient water 💧";
    }
    else if (msg.includes("fertilizer")) {
        reply = "Use NPK fertilizer based on soil test results.";
    }
    else if (msg.includes("pest")) {
        reply = "Use neem-based pesticides to control pests 🐛";
    }
    else if (msg.includes("weather")) {
        reply = "Avoid irrigation during heavy rain forecasts ☁️";
    }
    else {
        reply = "I can help with crops, soil, fertilizer, pests & weather 🌱";
    }

    chat.innerHTML += "<p><b>AgroBot:</b> " + reply + "</p>";
    chat.scrollTop = chat.scrollHeight;
    input.value = "";
}
