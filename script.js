// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPF1VE82Y3VkZe6IibjqKxBC-XHjM_Wco",
  authDomain: "chat-2024-ff149.firebaseapp.com",
  databaseURL: "https://chat-2024-ff149-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-2024-ff149",
  storageBucket: "chat-2024-ff149.appspot.com",
  messagingSenderId: "146349109253",
  appId: "1:146349109253:android:e593afbf0584762519ac6c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM elements
const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');
const connectionStatus = document.getElementById('connection-status');

// Connection monitoring
let isConnected = false;

db.ref(".info/connected").on("value", function(snapshot) {
  isConnected = snapshot.val() === true;
  if (isConnected) {
    connectionStatus.className = "connected";
    connectionStatus.textContent = "CONNECTED";
    addSystemMessage("Connected to server");
  } else {
    connectionStatus.className = "disconnected";
    connectionStatus.textContent = "DISCONNECTED";
    addSystemMessage("Connection lost - attempting to reconnect...");
  }
});

// Add system message to chat
function addSystemMessage(text) {
  const msgElem = document.createElement("div");
  msgElem.className = "msg system";
  msgElem.textContent = `[SYSTEM] ${text}`;
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to Firebase
function sendMessage() {
  const msg = msgInput.value.trim();
  if (msg !== "") {
    if (!isConnected) {
      addSystemMessage("Cannot send message - not connected to server");
      return;
    }
    
    // Add temporary local message
    const tempId = "temp-" + Date.now();
    const msgElem = document.createElement("div");
    msgElem.className = "msg";
    msgElem.textContent = `> ${msg}`;
    msgElem.id = tempId;
    chatBox.appendChild(msgElem);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Send to Firebase
    db.ref("messages").push({
      text: msg,
      time: Date.now(),
      sender: "user" // In a real app, you'd have user authentication
    })
    .then(() => {
      // Message sent successfully
      document.getElementById(tempId).remove();
    })
    .catch((error) => {
      addSystemMessage(`Error sending message: ${error.message}`);
      document.getElementById(tempId).remove();
    });
    
    msgInput.value = "";
  }
}

// Receive messages from Firebase
db.ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const msgElem = document.createElement("div");
  msgElem.className = "msg";
  msgElem.textContent = `> ${msg.text}`;
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Keyboard shortcuts
msgInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

// Initial welcome message
setTimeout(() => {
  addSystemMessage("Welcome to Hacker Chat Terminal");
  addSystemMessage("Type a message and press Enter to chat");
}, 500);

// Terminal boot effect
document.addEventListener('DOMContentLoaded', function() {
  const terminal = document.getElementById('terminal');
  terminal.style.opacity = '0';
  
  setTimeout(() => {
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.05;
      terminal.style.opacity = opacity;
      if (opacity >= 1) clearInterval(fadeIn);
    }, 30);
  }, 300);
});

// Input field focus effect
msgInput.addEventListener('focus', function() {
  this.parentElement.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
});

msgInput.addEventListener('blur', function() {
  this.parentElement.style.boxShadow = 'none';
});
