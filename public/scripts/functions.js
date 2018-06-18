const url = 'http://localhost:3000';

const getTodos = () => {
  axios.get(`${url}/todos`)
    .then(result => {
      renderAllTodos(result.data.todos);
    })
    .catch(error => {
      console.log(error);
    });
}

const removeTodo = (todo) => {
  axios.delete(`${url}/todos/${todo._id}`);
  getTodos();
}

const markComplete = (todo) => {
  axios.patch(`${url}/todos/${todo._id}`, {
    completed: !todo.completed
  });
  getTodos();
}

const renderAllTodos = (todos) => {
  const todoList = document.querySelector('.todos-list');
  todoList.textContent = '';

  todos.forEach(todo => {
    todoList.insertAdjacentElement('beforeend', renderTodo(todo));
  });
}

const renderTodo = (todo) => {
  const div = document.createElement('div');
  div.className = 'todo-container';

  const p = document.createElement('p');
  p.textContent = todo.text;
  p.addEventListener('click', () => markComplete(todo));
  if (todo.completed) {
    p.className = 'completed';
  }

  const button = document.createElement('button');
  button.textContent = 'X';
  button.addEventListener('click', () => removeTodo(todo));

  div.insertAdjacentElement('beforeend', p);
  div.insertAdjacentElement('beforeend', button);

  return div
}