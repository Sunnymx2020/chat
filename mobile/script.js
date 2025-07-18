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
let isFirstConnection = true;

db.ref(".info/connected").on("value", function(snapshot) {
  isConnected = snapshot.val() === true;
  if (isConnected) {
    connectionStatus.className = "connected";
    connectionStatus.textContent = "ONLINE";
    if (!isFirstConnection) {
      addSystemMessage("Connection restored");
    }
    isFirstConnection = false;
  } else {
    connectionStatus.className = "disconnected";
    connectionStatus.textContent = "OFFLINE";
    if (!isFirstConnection) {
      addSystemMessage("Connection lost - reconnecting...");
    }
  }
});

// Add system message to chat
function addSystemMessage(text) {
  const msgElem = document.createElement("div");
  msgElem.className = "msg system";
  msgElem.textContent = `[SYSTEM] ${text}`;
  chatBox.appendChild(msgElem);
  scrollToBottom();
}

// Scroll to bottom of chat
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to Firebase
function sendMessage() {
  const msg = msgInput.value.trim();
  if (msg !== "") {
    if (!isConnected) {
      addSystemMessage("Cannot send - offline. Will send when reconnected.");
      // Store message locally for later sending
      const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || []);
      unsentMessages.push(msg);
      localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages));
      
      // Show temporary message
      const tempId = "temp-" + Date.now();
      const msgElem = document.createElement("div");
      msgElem.className = "msg";
      msgElem.textContent = `> ${msg} (pending)`;
      msgElem.id = tempId;
      chatBox.appendChild(msgElem);
      scrollToBottom();
      
      msgInput.value = "";
      return;
    }
    
    // Add temporary local message
    const tempId = "temp-" + Date.now();
    const msgElem = document.createElement("div");
    msgElem.className = "msg";
    msgElem.textContent = `> ${msg}`;
    msgElem.id = tempId;
    chatBox.appendChild(msgElem);
    scrollToBottom();
    
    // Send to Firebase
    db.ref("messages").push({
      text: msg,
      time: Date.now(),
      sender: "user"
    })
    .then(() => {
      // Message sent successfully
      document.getElementById(tempId).remove();
      checkUnsentMessages();
    })
    .catch((error) => {
      addSystemMessage(`Error: ${error.message}`);
      document.getElementById(tempId).remove();
    });
    
    msgInput.value = "";
    msgInput.focus();
  }
}

// Check for unsent messages when connection is restored
function checkUnsentMessages() {
  const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || []);
  if (unsentMessages.length > 0 && isConnected) {
    addSystemMessage(`Sending ${unsentMessages.length} pending messages...`);
    unsentMessages.forEach(msg => {
      db.ref("messages").push({
        text: msg,
        time: Date.now(),
        sender: "user"
      });
    });
    localStorage.removeItem('unsentMessages');
  }
}

// Receive messages from Firebase
db.ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const msgElem = document.createElement("div");
  msgElem.className = "msg";
  msgElem.textContent = `> ${msg.text}`;
  chatBox.appendChild(msgElem);
  scrollToBottom();
});

// Keyboard and touch events
msgInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

sendBtn.addEventListener("touchstart", function(e) {
  e.preventDefault();
  this.classList.add('active');
}, {passive: false});

sendBtn.addEventListener("touchend", function(e) {
  e.preventDefault();
  this.classList.remove('active');
  sendMessage();
}, {passive: false});

// Auto-focus input on load and after sending
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    msgInput.focus();
    
    // Initial welcome messages
    addSystemMessage("Hacker Chat Terminal v1.0");
    addSystemMessage("Connected to secure channel");
    
    // Check for unsent messages
    checkUnsentMessages();
  }, 500);
});

// Prevent zooming on mobile
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Handle virtual keyboard appearance
window.addEventListener('resize', function() {
  setTimeout(scrollToBottom, 300);
});

// Add PWA manifest (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
