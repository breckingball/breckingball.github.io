// ToDoItem class containing the information about a todo
class ToDoItem {
    constructor(course, assignment, month, day) {
        this.course = course;
        this.assignment = assignment;
        this.month = month;
        this.day = day;
    }
}
// ToDoList class containing assignments sorted by due date
class ToDoList {

    // Creates the todolist by reading localstorage
    constructor() {
        this.to_do_items = JSON.parse(localStorage.getItem("todoitems")) || [];
    }

    // Inserts a new todo in sorted order by due date
    insert(to_insert) {
        if (this.to_do_items.length == 0) { this.to_do_items.push(to_insert); return; }
        for (var i = 0; i < this.to_do_items.length; i++) {
            if ((to_insert["month"] < this.to_do_items[i]["month"])
                || (to_insert["month"] == this.to_do_items[i]["month"]
                    && to_insert["day"] < this.to_do_items[i]["day"]))
                break;
        }
        this.to_do_items.splice(i, 0, to_insert);
    }

    // Removes a todo from index position
    remove(index) {
        this.to_do_items.splice(index, 1);
    }


}

// Runs before window is terminated, stores the list in localstorage for next time
window.addEventListener("beforeunload", () => {
    localStorage.setItem("todoitems", JSON.stringify(todos.to_do_items));
});




const todos = new ToDoList();
const todoList = document.getElementById("todoList");

// Prints the todolist to the screen
function updateToDoList() {

    // Clear the list
    todoList.innerHTML = "";

    // For each todo, add it to the list along with a button
    todos.to_do_items.forEach((item, index) => {
        const list_item = document.createElement("li");
        list_item.innerHTML = `${item.course} - ${item.assignment} - ${item.month}/${item.day} <button onclick="removeTodo(${index})">Done</button>`;
        todoList.appendChild(list_item);
    });
}

// Adds a new todo to the list
function addTodo() {

    // Retrieving input fields
    const course = document.getElementById("course").value;
    const assignment = document.getElementById("assignment").value;
    const date = document.getElementById("date").value.split("-");
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);

    // Invalid entry checking
    if (course == "default" || assignment == "" ||
        !(month >= 1 && month <= 12) ||
        !(day >= 1 && day <= 31)
    ) return;

    // Inserting new todo item into the list and printing
    todos.insert(new ToDoItem(course, assignment, month, day));
    updateToDoList();

    // Clearing input fields
    document.getElementById("course").value = "default";
    document.getElementById("assignment").value = "";
    document.getElementById("date").value = "";
}

// Removes a todo from the list and prints new list
function removeTodo(index) {
    todos.remove(index);
    updateToDoList();
}

// initial output of list
updateToDoList();

