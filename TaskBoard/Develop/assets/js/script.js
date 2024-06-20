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
    // Create a new card element and add the classes `card`, `pro