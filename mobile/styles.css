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

// Fixed: Initialize unsentMessages properly
function getUnsentMessages() {
  try {
    const messages = localStorage.getItem('unsentMessages');
    return messages ? JSON.parse(messages) : [];
  } catch (e) {
    console.error("Error parsing unsent messages:", e);
    return [];
  }
}

db.ref(".info/connected").on("value", function(snapshot) {
  isConnected = snapshot.val() === true;
  if (isConnected) {
    connectionStatus.className = "connected";
    connectionStatus.textContent = "ONLINE";
    if (!isFirstConnection) {
      addSystemMessage("Connection restored");
      checkUnsentMessages();
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

function addSystemMessage(text) {
  const msgElem = document.createElement("div");
  msgElem.className = "msg system";
  msgElem.textContent = `[SYSTEM] ${text}`;
  chatBox.appendChild(msgElem);
  scrollToBottom();
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Added: Command processor
function processCommand(cmd) {
  const args = cmd.split(' ');
  const command = args[0].toLowerCase();
  
  switch(command) {
    case '/help':
      addSystemMessage("Available commands:");
      addSystemMessage("/help - Show this help");
      addSystemMessage("/clear - Clear chat");
      addSystemMessage("/time - Show current time");
      addSystemMessage("/users - Show connected users (demo)");
      addSystemMessage("/hack - Fun hacking animation");
      return true;
      
    case '/clear':
      chatBox.innerHTML = '';
      return true;
      
    case '/time':
      addSystemMessage(`Current time: ${new Date().toLocaleTimeString()}`);
      return true;
      
    case '/users':
      simulateUserList();
      return true;
      
    case '/hack':
      startHackAnimation();
      return true;
      
    default:
      return false;
  }
}

// Added: Fun hacking animation
function startHackAnimation() {
  const originalContent = chatBox.innerHTML;
  const messages = [
    "> Initializing hack sequence...",
    "> Bypassing firewall...",
    "> Accessing mainframe...",
    "> Cracking encryption...",
    "> Uploading payload...",
    "> Hack complete! Access granted."
  ];
  
  chatBox.innerHTML = '';
  let i = 0;
  
  const hackInterval = setInterval(() => {
    if (i < messages.length) {
      const msgElem = document.createElement("div");
      msgElem.className = "msg";
      msgElem.textContent = messages[i];
      chatBox.appendChild(msgElem);
      scrollToBottom();
      i++;
    } else {
      clearInterval(hackInterval);
      setTimeout(() => {
        chatBox.innerHTML = originalContent;
        addSystemMessage("Hack simulation complete");
      }, 1000);
    }
  }, 800);
}

// Added: Simulate user list
function simulateUserList() {
  const users = [
    "root@darknet",
    "anonymous",
    "neo",
    "zerocool",
    "crash_override",
    "acid_burn"
  ];
  
  addSystemMessage("Connected users:");
  users.forEach(user => {
    const msgElem = document.createElement("div");
    msgElem.className = "msg system";
    msgElem.textContent = ` • ${user}`;
    chatBox.appendChild(msgElem);
  });
  scrollToBottom();
}

function sendMessage() {
  const msg = msgInput.value.trim();
  if (msg !== "") {
    // Check if it's a command
    if (msg.startsWith('/')) {
      if (!processCommand(msg)) {
        addSystemMessage(`Unknown command: ${msg.split(' ')[0]}`);
      }
      msgInput.value = "";
      return;
    }
    
    if (!isConnected) {
      addSystemMessage("Cannot send - offline. Will send when reconnected.");
      const unsentMessages = getUnsentMessages();
      unsentMessages.push(msg);
      localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages));
      
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
    
    const tempId = "temp-" + Date.now();
    const msgElem = document.createElement("div");
    msgElem.className = "msg";
    msgElem.textContent = `> ${msg}`;
    msgElem.id = tempId;
    chatBox.appendChild(msgElem);
    scrollToBottom();
    
    db.ref("messages").push({
      text: msg,
      time: Date.now(),
      sender: "user"
    })
    .then(() => {
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

function checkUnsentMessages() {
  const unsentMessages = getUnsentMessages();
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

// Receive messages
db.ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const msgElem = document.createElement("div");
  msgElem.className = "msg";
  msgElem.textContent = `> ${msg.text}`;
  chatBox.appendChild(msgElem);
  scrollToBottom();
});

// Event listeners
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

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    msgInput.focus();
    addSystemMessage("Hacker Chat Terminal v1.1");
    addSystemMessage("Type /help for commands");
    checkUnsentMessages();
  }, 500);
});

// Prevent zooming
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Handle keyboard
window.addEventListener('resize', function() {
  setTimeout(scrollToBottom, 300);
});

// PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
  }
