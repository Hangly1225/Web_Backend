let btnAddTaskEl = document.querySelector('.form-control');
let taskNameEl = document.querySelector('#content');
let template = document.querySelector('#task-template')


let tasks = getTaskFromLocalStorage();
renderTask(tasks);

btnAddTaskEl.addEventListener('submit', function() {
    if (!taskNameEl.value) {
        alert('Please enter the task name.');
        return false;
    }

    let taskID = this.getAttribute('id');
    let tasks = getTaskFromLocalStorage();
    let task = { name: taskNameEl.value, done: false }; 

    if (taskID == 0 || taskID) {
        tasks[taskID] = task;
        this.removeAttribute('id');
    } else {
        tasks.push(task);
    }
    taskNameEl.value = '';

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTask(tasks);
});

function editTask(id) {
    let tasks = getTaskFromLocalStorage();

    if (tasks.length > 0) {
        taskNameEl.value = tasks[id].name;
        btnAddTaskEl.setAttribute('id', id);
    }
}

function deleteTask(id) {
    if (confirm('Do you want to delete?')) {
        let tasks = getTaskFromLocalStorage();
        tasks.splice(id, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTask(getTaskFromLocalStorage());
    }
}

function toggleTaskStatus(id) {
    let tasks = getTaskFromLocalStorage();
    tasks[id].done = !tasks[id].done;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTask(tasks);
}

function renderTask(tasks = []) {
    const resultContainer = document.querySelector('#result');

    resultContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();

    tasks.forEach((task, index) => {
        const clone = document.importNode(template.content, true);

        clone.querySelector('.task-name').textContent = task.name;
        clone.querySelector('.edit-link').addEventListener('click', () => editTask(index));
        clone.querySelector('.delete-link').addEventListener('click', () => deleteTask(index))

        const doneButton = clone.querySelector('.task-status');
        doneButton.checked = task.done
        doneButton.addEventListener('change', () => toggleTaskStatus(index));

        fragment.appendChild(clone);
        
    });

    resultContainer.appendChild(fragment);
}

function getTaskFromLocalStorage(){
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}