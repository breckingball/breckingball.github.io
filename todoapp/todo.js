// ToDoItem class containing the information about a todo
class ToDoItem {
    constructor(course, assignment, month, day, year, date) {
        this.course = course;
        this.assignment = assignment;
        this.month = month;
        this.day = day;
        this.year = year;
        this.date = date;
    }
}
class Course {
    constructor(number, name){
        this.number = number;
        this.name = name;
    }
}
// ToDoList class containing assignments sorted by due date
class ToDoList {

    // Creates the todolist by reading localstorage
    constructor() {
        this.to_do_items = JSON.parse(localStorage.getItem("todoitems")) || [];
        this.class_list = JSON.parse(localStorage.getItem("classlist")) || [];
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
    removeTodo(index) {
        this.to_do_items.splice(index, 1);
    }

    removeClass(index) {
        this.class_list.splice(index, 1);
    }

}

// Runs before window is terminated, stores the list in localstorage for next time
window.addEventListener("beforeunload", () => {
    localStorage.setItem("todoitems", JSON.stringify(todos.to_do_items));
    localStorage.setItem("classlist", JSON.stringify(todos.class_list));
});




const todos = new ToDoList();


// Prints the todolist to the screen
function updateToDoList() {
    const todoList = document.getElementById("todoList");
   
    // Clear the list
    todoList.innerHTML = "";

    // For each todo, add it to the list along with a button
    todos.to_do_items.forEach((item, index) => {
        const list_item = document.createElement("li");
        list_item.innerHTML = `${item.course} - ${item.assignment} - ${item.month}/${item.day} <button onclick="editTodo(${index})">Edit</button> <button onclick="removeTodo(${index})">Done</button>`;
        todoList.appendChild(list_item);
    });
}

// Adds a new todo to the list
function addTodo() {

    // Retrieving input fields
    const course = document.getElementById("course").value;
    const assignment = document.getElementById("assignment").value;
    const date = document.getElementById("date").value;
    const date_split = date.split("-");
    const year = parseInt(date_split[0]);
    const month = parseInt(date_split[1]);
    const day = parseInt(date_split[2]);

    // Invalid entry checking
    if (course == "default" || assignment == "" ||
        !(month >= 1 && month <= 12) ||
        !(day >= 1 && day <= 31)
    ) return;

    // Inserting new todo item into the list and printing
    todos.insert(new ToDoItem(course, assignment, month, day, year, date));
    updateToDoList();

    // Clearing input fields
    document.getElementById("course").value = "default";
    document.getElementById("assignment").value = "";
    document.getElementById("date").value = "";
}

// Removes a todo from the list and prints new list
function removeTodo(index) {
    todos.removeTodo(index);
    updateToDoList();
}

// Edits a todo from the list
function editTodo(index) {
    
    // Remove the todo from the list, update list
    const to_edit = todos.to_do_items[index];
    removeTodo(index);

    // Fill in the input fields with data from todo
    document.getElementById("course").value = to_edit.course;
    document.getElementById("assignment").value = to_edit.assignment;
    document.getElementById("date").value = to_edit.date;

}

function addClass(){
    const class_number = document.getElementById("classNumber").value;
    const class_title = document.getElementById("className").value;

    if (class_number == "" || class_title == "") return;
    // Add new class name to class_list
    todos.class_list.push(new Course(class_number, class_title));
    // Sort new list into alphabetical order
    todos.class_list.sort((a,b) => a.number.localeCompare(b.number));

    updateClassList();

   

    document.getElementById("classNumber").value = "";
    document.getElementById("className").value = "";
}

function removeClass(index) {
    todos.removeClass(index);
    updateClassList();
}

function updateClassList() {
    const classList = document.getElementById("classList");
    // Clear the list
    classList.innerHTML = "";

    // For each todo, add it to the list along with a button
    todos.class_list.forEach((item, index) => {
        const list_item = document.createElement("li");
        list_item.innerHTML = `${item.number} - ${item.name} <button onclick="removeClass(${index})">Remove</button>`;
        classList.appendChild(list_item);
    });
}
// Edits the existing classes
function loadEditClasses(){
    document.getElementById("screen").innerHTML = 
    `<div id="inputs">
	    <h2>Edit Classes</h2>
		<label for="classNumber">Course Number:</label>
        <input type="text" id="classNumber"><br>
        <label for="className">Course Name:</label>
        <input type="text" id="className"><br>
		<button onclick="addClass()">Add To Class List</button>
        <button onclick="loadMainPage()">To Do List</button>
	</div>
	<div id="list">
		<ul id="classList"></ul>
	</div>`;
    updateClassList();
}

function loadMainPage(){
    document.getElementById("screen").innerHTML = 
    `<div id="inputs">
	    <h2>To Do List</h2>
		<label for="course">Course:</label>
		<select name="course" id="course">
			<option value="default" selected disabled hidden>Select Course</option>
		</select>
		<label for="assignment">Assignment Name:</label>
		<input type="text" id="assignment"><br>
		<label for="date">Due Date:</label>
		<input type="date" id="date"><br>
		<button onclick="addTodo()">Add To List</button>
		<button onclick="loadEditClasses()">Edit Classes</button>
	</div>
	<div id="list">
		<ul id="todoList"></ul>
	</div>`;
    // load classes
    const classes = document.getElementById("course");
    todos.class_list.forEach((item) =>{
        const class_item = document.createElement("option");
        class_item.value = `${item.number}`;
        class_item.innerHTML = `${item.number} - ${item.name}`;
        classes.appendChild(class_item);
    });
    updateToDoList();

   
}

loadMainPage();

