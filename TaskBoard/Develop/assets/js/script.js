// Retrieve tasks and nextId from localStorage or initialize them
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

const taskForm = $('#taskForm');
const createTaskBtn = $('.createTaskBtn');
const closeTaskFormBtn = $('.closeTaskForm');
const taskName = $('#taskName');
const taskDate = $('#datePicker');
const taskDescription = $('#taskDescription');
const toDoCards = $('#todo-cards');

// Function to generate a unique task ID
function generateTaskId() {
    return 'task-' + nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    // Create a new card element and add the classes `card`, `project-card`, `draggable`, and `my-3`. Also add a `data-task-id` attribute and set it to the task id.
    const taskCard = $('<div>')
        .addClass('card project-card draggable my-3')
        .attr('data-task-id', task.taskID);

    // Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the task name.
    const cardHeader = $('<div>')
        .addClass('card-header h4')
        .text(task.taskName);

    // Create a new card body element and add the class `card-body`.
    const cardBody = $('<div>').addClass('card-body');

    // Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the task type.
    const cardType = $('<p>')
        .addClass('card-text')
        .text(task.taskDescription);

    // Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the task due date.
    const cardDueDate = $('<p>')
        .addClass('card-text')
        .text(task.taskDueDate);

    // Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-task-id` attribute and set it to the task id.
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.taskID)
        .on('click', handleDeleteTask);

    // Sets the card background color based on due date. Only apply the styles if the due date exists and the status is not done.
    if (task.taskDueDate) {
        const now = dayjs();
        const taskDueDate = dayjs(task.taskDueDate, 'YYYY-MM-DD');

        // If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // Append the card description, card due date, and card delete button to the card body.
    cardBody.append(cardType, cardDueDate, cardDeleteBtn);

    // Append the card header and card body to the card.
    taskCard.append(cardHeader, cardBody);

    // Append the card to the toDoCards container.
    toDoCards.append(taskCard);
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    toDoCards.empty();
    taskList.forEach(task => createTaskCard(task));
}

// Function to handle adding a new task
function handleAddTask() {
    const task = {
        taskID: generateTaskId(),
        taskName: taskName.val(),
        taskDueDate: taskDate.val(),
        taskDescription: taskDescription.val()
    };
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    createTaskCard(task);
    taskForm[0].reset();
}

// Function to handle deleting a task
function handleDeleteTask() {
    const taskID = $(this).attr('data-task-id');
    taskList = taskList.filter(task => task.taskID !== taskID);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Handle task drop logic here
}

// Initialize the page
$(document).ready(function () {
    renderTaskList();
    taskDate.datepicker({ clearBtn: true });
    createTaskBtn.on('click', handleAddTask);
    closeTaskFormBtn.on('click', function() {
        taskForm[0].reset();
    });
    // Add other event listeners and initialization logic here
});
