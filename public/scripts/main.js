getTodos();

const list = document.querySelector('.todos-list');

document.querySelector('#todoForm').addEventListener('submit', e => {
  e.preventDefault();
  axios.post('./todos', {
    text: e.target[0].value
  })
  e.target[0].value = '';
  getTodos();
});