window.addEventListener("load", () => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const nameInput = document.querySelector("#name");
  const newTodoForm = document.querySelector("#new-todo-form");

  const username = localStorage.getItem("username") || "";

  nameInput.value = username;

  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
  });

  newTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTodo(); // Call the addNewTodo function when the form is submitted
  });

  // Keep track of changes
  let undoStack = [];
  let redoStack = [];

  function addNewTodo() {
    const dueDateInput = document.querySelector("#datepicker");
    const dueTimeInput = document.querySelector("#due-time");

    const todo = {
      content: newTodoForm.elements.content.value,
      category: newTodoForm.elements.category.value,
      dueDate: dueDateInput.value,
      dueTime: dueTimeInput.value,
      done: false,
      createdAt: new Date(),
    };

    todos.push(todo);
    undoStack.push([...todos]); // Push a copy of the todos array onto the undo stack
    redoStack = []; // Clear the redo stack
    localStorage.setItem("todos", JSON.stringify(todos));

    // Reset the form
    newTodoForm.reset();
    DisplayTodos();
  }

  // Undo and Redo functions
  function undo() {
    if (undoStack.length > 1) {
      redoStack.push(undoStack.pop()); // Move the current state to redo stack
      todos = [...undoStack[undoStack.length - 1]]; // Restore the previous state
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    }
  }

  function redo() {
    if (redoStack.length > 0) {
      undoStack.push([...todos]); // Move the current state to undo stack
      todos = [...redoStack.pop()]; // Restore the next state
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    }
  }

  // Todos Functionality
  function DisplayTodos() {
    const todoList = document.querySelector("#todo-list");

    todoList.innerHTML = "";

    todos = JSON.parse(localStorage.getItem("todos")) || [];

    todos.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");

      const label = document.createElement("label");
      const input = document.createElement("input");
      const span = document.createElement("span");
      const content = document.createElement("div");
      const actions = document.createElement("div");
      const edit = document.createElement("button");
      const deleteButton = document.createElement("button");

      input.type = "checkbox";
      input.checked = todo.done;
      span.classList.add("bubble");

      if (todo.category == "personal") {
        span.classList.add("personal");
      } else {
        span.classList.add("business");
      }

      content.classList.add("todo-content");
      actions.classList.add("actions");
      edit.classList.add("edit");
      deleteButton.classList.add("delete");

      content.innerHTML = `<input type="text" value="${todo.content}" readonly>
    <div>Due Date: ${todo.dueDate} | Due Time: ${todo.dueTime}</div>
    `;
      edit.innerHTML = "Edit";
      deleteButton.innerHTML = "Delete";

      label.appendChild(input);
      label.appendChild(span);
      actions.appendChild(edit);
      actions.appendChild(deleteButton);
      todoItem.appendChild(label);
      todoItem.appendChild(content);
      todoItem.appendChild(actions);

      todoList.appendChild(todoItem);

      if (todo.done) {
        todoItem.classList.add("done");
      }

      input.addEventListener("click", (e) => {
        todo.done = e.target.checked;
        localStorage.setItem("todos", JSON.stringify(todos));

        if (todo.done) {
          todoItem.classList.add("done");
        } else {
          todoItem.classList.remove("done");
        }

        DisplayTodos();
      });

      edit.addEventListener("click", (e) => {
        const input = content.querySelector("input");
        input.removeAttribute("readonly");
        input.focus();
        input.addEventListener("blur", (e) => {
          input.setAttribute("readonly", true);
          todo.content = e.target.value;
          localStorage.setItem("todos", JSON.stringify(todos));
          DisplayTodos();
        });
      });

      deleteButton.addEventListener("click", (e) => {
        todos = todos.filter((t) => t !== todo);
        localStorage.setItem("todos", JSON.stringify(todos));
        todos = JSON.parse(localStorage.getItem("todos")) || [];
        DisplayTodos();
      });
    });
  }

  DisplayTodos();
});
