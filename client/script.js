import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatCont = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '....')
    {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length)
    {
      element.innerHTML += text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const random = Math.random();
  const hexadecimalString = random.toString(16);

  return `${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? "bot" : "user" }"
            />
          </div>

          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async(e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatCont.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  const uniqueId = generateUniqueId();
  chatCont.innerHTML += chatStripe(true, data.get('prompt'), uniqueId);

  chatCont.scrollTop = chatCont.scrollHeight;

  const msgDiv = document.getElementById(uniqueId);

  loader(msgDiv);

  const response = await fetch('https://chatgpt-clone-89lg.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);

  msgDiv.innerHTML = " ";

  if(response.ok)
  {
    const data = await response.json();
    const parsedData = data.bot.trim();
    console.log(parsedData)
    typeText(msgDiv, parsedData);
  }
  else
  {
    const err = await response.text();

    msgDiv.innerHTML = "Something wrong";

    alert(err);
  }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13)
  {
    handleSubmit(e);
  }
});