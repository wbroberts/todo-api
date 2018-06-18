getTodos();

const list = document.querySelector('.todos-list');

document.querySelector('#todoForm').addEventListener('submit', e => {
  e.preventDefault();
  const todo = {
    text: e.target[0].value.trim()
  }
  axios.post('./todos', todo);
  e.target[0].value = '';
  getTodos();
});