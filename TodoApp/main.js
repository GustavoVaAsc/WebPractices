const taskList = document.querySelector('#task-list');
const newTaskInput = document.querySelector('#new-task-input');
const addTaskButton = document.querySelector('#add-task-button');

const tasks = [];

function saveToLocal(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks));

}
const app = {
    tasks,
    taskList,
    newTaskInput,
};

window.onload = function(){
    const savedTasks=JSON.parse(localStorage.getItem('tasks')) ||[];
    app.tasks = savedTasks.map((task) =>{
        return createTask(task.title,task.isComplete);
    })

    app.tasks.forEach((task) => {
        return addTaskToList(task,app.taskList);
    })
}

function createTask(title, isComplete = false){
    return {
        id: Date.now(),
        title,
        isComplete,
    };
}

function addTaskToList(task, taskList){
    const taskElement = createTaskElement(task); // Use createTaskElement here
    taskList.appendChild(taskElement);
}

function addTask(app){
    const newTaskTitle = app.newTaskInput.value;
    if (newTaskTitle.trim() === '') return; // Ensure there's a task title
    const newTask = createTask(newTaskTitle);
    app.tasks.push(newTask);

    addTaskToList(newTask, app.taskList);
    saveToLocal(app.tasks);
    app.newTaskInput.value = ''; // Clear input field after adding task

}

function createTaskElement(task){
    const taskElement = document.createElement('li');

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.isComplete;
    taskCheckbox.addEventListener('change', () => {
        task.isComplete = taskCheckbox.checked;
        taskText.classList.toggle("complete", task.isComplete);
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.title;
    taskText.classList.toggle("completed", task.isComplete);

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.textContent = 'Eliminar';
    taskDeleteButton.className = 'delete-button';
    taskDeleteButton.addEventListener('click', () => {
        taskElement.remove();
        const taskIndex = app.tasks.indexOf(task);

        if(taskIndex > -1){
            app.tasks.splice(taskIndex,1);
        }
        saveToLocal(app.tasks);
    });

    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(taskDeleteButton);

    return taskElement;
}

addTaskButton.addEventListener('click', () => {
    addTask(app);
});

newTaskInput.addEventListener('keydown',(event)=>{
    if(event.key === "Enter"){
        addTask(app);
    }
})
