const todoList = document.getElementById('todo-list');
const addTaskButton = document.getElementById('add-task-button');
const dateElement = document.querySelector('.date');
const timeElement = document.querySelector('.time');

function updateDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  dateElement.textContent = formattedDate;
  timeElement.textContent = formattedTime;
}

updateDateTime();
setInterval(updateDateTime, 60000);

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task-item').forEach(taskItem => {
    const text = taskItem.querySelector('.task-input').value;
    const completed = taskItem.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(text, completed = false) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');

  const label = document.createElement('label');
  label.classList.add('checkbox-container');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', () => {
    toggleTaskCompletion(checkbox);
    saveTasks();
  });

  const customCheckbox = document.createElement('span');
  customCheckbox.classList.add('custom-checkbox');

  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.classList.add('task-input');
  taskInput.value = text;
  taskInput.placeholder = "Enter task";
  taskInput.style.width = "100%";
  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      taskInput.blur();
    }
  });
  taskInput.addEventListener('blur', saveTasks);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = "✕";
  deleteButton.addEventListener('click', () => {
    todoList.removeChild(taskItem);
    saveTasks();
  });

  label.appendChild(checkbox);
  label.appendChild(customCheckbox);
  label.appendChild(taskInput);

  taskItem.appendChild(label);
  taskItem.appendChild(deleteButton);
  todoList.appendChild(taskItem);
}

function addTask() {
  createTaskElement("");
  saveTasks();
}

function toggleTaskCompletion(checkbox) {
  const taskLabel = checkbox.nextElementSibling.nextElementSibling;
  if (checkbox.checked) {
    taskLabel.classList.add('completed');
    taskLabel.disabled = true;
  } else {
    taskLabel.classList.remove('completed');
    taskLabel.disabled = false;
  }
}

loadTasks();

addTaskButton.addEventListener('click', addTask);
