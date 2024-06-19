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
const inProgressCards = $('#in-progress-cards');
const doneCards = $('#done-cards');
const taskContainer = $('.swim-lanes')

// Function to generate a unique task ID
function generateTaskId() {
    const taskID = 'task-' + Math.random().toString(36).substring(2, 11);
    console.log(taskID);
    return taskID;
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

    // Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete".
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger deleteTaskBtn')
        .text('Delete');

    // If the Card has been placed in Done Lane, leave it white. 
    if (task.status !== 'done') {
        // Sets the card background color based on due date. Only apply the styles if the due date exists and the status is not done.
        if (task.taskDueDate) {
            const now = dayjs();
            const taskDueDate = dayjs(task.taskDueDate, 'YYYY-MM-DD');

            //If the task is due today, make the card yellow. If it is overdue, make it red.
            if (now.isSame(taskDueDate, 'day')) {
                taskCard.addClass('bg-warning text-white');
            } else if (now.isAfter(taskDueDate)) {
                taskCard.addClass('bg-danger text-white');
                cardDeleteBtn.addClass('border-light');
            }
        }
    }

    // Append the card content to the card body.
    cardBody.append(cardType, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    // Append the task card to the appropriate lane based on its status
    if (task.status === 'to-do') {
        toDoCards.append(taskCard);
    } else if (task.status === 'in-progress') {
        inProgressCards.append(taskCard);
    } else if (task.status === 'done') {
        doneCards.append(taskCard);
    }

    // Make the task card draggable
    taskCard.draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
        start: function (event, ui) {
            $('body').css('cursor', 'grabbing');
        },
        stop: function (event, ui) {
            $('body').css('cursor', 'auto');
        }
    });
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    toDoCards.empty();
    inProgressCards.empty();
    doneCards.empty();

    // Sorting the cards by due date, to keep the earliest due always on top of the stack.
    taskList.sort((a, b) => {
        if (!a.taskDueDate) return 1;
        if (!b.taskDueDate) return -1;
        return dayjs(a.taskDueDate).diff(dayjs(b.taskDueDate));
    });

    taskList.forEach(task => createTaskCard(task));
}

// Function to handle adding a new task
function handleAddTask() {
    const task = {
        taskID: generateTaskId(),
        taskName: taskName.val(),
        taskDueDate: taskDate.val(),
        taskDescription: taskDescription.val(),
        status: 'to-do'
    };
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();
    taskForm[0].reset();
}

// Function to handle deleting a task
function handleDeleteTask() {
    const taskCard = $(this).closest('.card');
    const taskID = taskCard.attr('data-task-id');
    taskList = taskList.filter(task => task.taskID !== taskID);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskID = ui.draggable.attr('data-task-id');
    const newLane = $(this).attr('id');
    const taskIndex = taskList.findIndex(task => task.taskID === taskID);

    if (taskIndex >= 0) {
        taskList[taskIndex].status = newLane;
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}

// Initialize the page
$(document).ready(function () {
    renderTaskList();
    taskDate.datepicker();

    // Create Task on Add Task Button Click
    createTaskBtn.on('click', handleAddTask);

    // Delete Task on Delete Task Button Click
    taskContainer.on('click', '.deleteTaskBtn', handleDeleteTask);

    // Reset form on cancel task creation
    closeTaskFormBtn.on('click', function () {
        taskForm[0].reset();
    });

    // Make lanes droppable
    $('.droppable').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
});