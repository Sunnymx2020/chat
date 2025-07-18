const socket = io(); // Connect to WebSocket server

const output = document.getElementById('output');
const commandInput = document.getElementById('command-input');

commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const command = commandInput.value.trim();
    if (command) {
      appendOutput(`$ ${command}\n`, 'input');
      socket.emit('execute', command);
      commandInput.value = '';
    }
  }
});

// Handle command output from server
socket.on('output', (data) => {
  appendOutput(data, 'output');
});

// Scroll to bottom when new output arrives
function appendOutput(text, className) {
  const line = document.createElement('div');
  line.className = className;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// Focus input on load
window.onload = () => {
  commandInput.focus();
};
