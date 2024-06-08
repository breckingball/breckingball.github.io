
class ToDoItem {
    constructor(course, assignment, month, day) {
        this.course = course;
        this.assignment = assignment;
        this.month = month;
        this.day = day;
    }
}
// todo list class containing assignments sorted by due date
class ToDoList {

    constructor() {
        this.to_do_items = JSON.parse(localStorage.getItem("todoitems")) || [];
    }

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

    remove(index) {
        this.to_do_items.splice(index, 1);
    }


}

// runs before window is terminated
window.addEventListener("beforeunload", () => {
    localStorage.setItem("todoitems", JSON.stringify(todos.to_do_items));
});




const todos = new ToDoList();
const todoList = document.getElementById("todoList");

function updateToDoList() {
    todoList.innerHTML = "";
    todos.to_do_items.forEach((item, index) => {
        const list_item = document.createElement("li");
        list_item.innerHTML = `${item.course} - ${item.assignment} - ${item.month}/${item.day} <button onclick="removeTodo(${index})">Done</button>`;
        todoList.appendChild(list_item);
    });
}

function addTodo() {
    // Retrieving input fields
    const course = document.getElementById("course").value;
    const assignment = document.getElementById("assignment").value;
    const date = document.getElementById("date").value.split("/");
    const month = parseInt(date[0]);
    const day = parseInt(date[1]);

    if (course == "default" || assignment == "" ||
        !(month >= 1 && month <= 12) ||
        !(day >= 1 && day <= 31)
    ) return;

    // Inserting new todo item into the list
    todos.insert(new ToDoItem(course, assignment, month, day));
    updateToDoList();

    // Clearing input fields
    document.getElementById("course").value = "default";
    document.getElementById("assignment").value = "";
    document.getElementById("date").value = "";
}

function removeTodo(index) {
    todos.remove(index);
    updateToDoList();
}

updateToDoList();

