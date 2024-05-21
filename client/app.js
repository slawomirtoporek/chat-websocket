const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

//socket.on('message', (event) => addMessage(event.author, event.content));
socket.on('message', ({ author, content }) => addMessage(author, content));

let userName = '';

const login = e => {
  e.preventDefault();

  if (userNameInput.value) {
    userName = userNameInput.value;
    socket.emit('join', userName);
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  } else {
    alert('This field is required');
  };
};

loginForm.addEventListener('submit', login);

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');

  if (author === userName) message.classList.add('message--self');

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if(!messageContent.length) {
    alert('You have to type something!');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  };
};

addMessageForm.addEventListener('submit', sendMessage);