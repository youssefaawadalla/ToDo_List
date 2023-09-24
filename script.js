const taskInput = document.getElementById('task');
const addTaskButton = document.getElementById('addTask');
const clearCompletedButton = document.getElementById('clearAll');
const tasksList = document.querySelector('.tasks-list');

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        addTask();
    }
});
clearCompletedButton.addEventListener('click', clearCompletedTasks);
tasksList.addEventListener('click', toggleTask);

function addTask(){
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskItem(taskText);
    tasksList.appendChild(taskItem);

    taskInput.value = '';
    taskInput.focus();

    saveTasksToLocalStorage();
}

function createTaskItem(taskText){
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <input type="checkbox">
        <label>${taskText}</label>
        <button class="delete-task">Delete</button>
    `;

    return taskItem;
}

function clearCompletedTasks(){
    const completedTasks = document.querySelectorAll('.task-item input:checked');
    completedTasks.forEach(task => {
        task.parentElement.remove();
    });

    saveTasksToLocalStorage();
}

function toggleTask(e){
    if (e.target.tagName === 'INPUT'){
        const taskLabel = e.target.nextElementSibling;
        taskLabel.classList.toggle('completed');
        saveTasksToLocalStorage();
    } else if (e.target.classList.contains('delete-task')){
        e.target.parentElement.remove();
        saveTasksToLocalStorage();
    }
}

function saveTasksToLocalStorage(){
    const tasks = [];
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(taskItem => {
        const taskText = taskItem.querySelector('label').textContent;
        const isCompleted = taskItem.querySelector('input').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage(){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskItem(task.text);
        const taskCheckbox = taskItem.querySelector('input');
        if (task.completed){
            taskCheckbox.checked = true;
            taskItem.querySelector('label').classList.add('completed');
        }
        tasksList.appendChild(taskItem);
    });
}

loadTasksFromLocalStorage();