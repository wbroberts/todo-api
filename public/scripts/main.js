getTodos();

const list = document.querySelector('.todos-list');

document.querySelector('#todoForm').addEventListener('submit', e => {
  e.preventDefault();

  axios.post('http://localhost:3000/todos', {
    text: e.target[0].value
  })

  getTodos();
  e.target[0].value = '';
});