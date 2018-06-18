const url = 'http://localhost:3000';

// Gets all todos from db
const getTodos = () => {
  axios.get(`${url}/todos`)
    .then(result => {
      renderAllTodos(result.data.todos);
    })
    .catch(error => {
      console.log(error);
    });
}

// Removes the todo from db and resets DOM
const removeTodo = (todo) => {
  axios.delete(`${url}/todos/${todo._id}`);
  getTodos();
}

// Marks the todo complete or incomplete and resets DOM
const markComplete = (todo) => {
  axios.patch(`${url}/todos/${todo._id}`, {
    completed: !todo.completed
  });
  getTodos();
}

// Basic rendering while iterating through the todos
const renderAllTodos = (todos) => {
  const todoList = document.querySelector('.todos-list');
  todoList.textContent = '';
  sortIncomplete(todos)
    .forEach(todo => {
      todoList.insertAdjacentElement('afterbegin', renderTodo(todo));
    });
}

// Renders each todo div
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

  return div;
}

// Sorts the todos by its completed status
const sortIncomplete = (todos) => {
  return todos.sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    else if (!a.completed && b.completed) return 1;
    else return 0;
  });
}