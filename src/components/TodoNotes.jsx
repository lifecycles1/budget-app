import React from "react";
import "./TodoNotes.css";
import trash from "../assets/trash.svg";

function TodoNotes() {
  const [todoItems, setTodoItems] = React.useState([
    // { id: 1, text: "Item 1", editing: false, inputValue: "Item 1", completed: false },
    // { id: 2, text: "Item 2", editing: false, inputValue: "Item 2", completed: false },
    // { id: 3, text: "Item 3", editing: false, inputValue: "Item 3", completed: false },
  ]);

  React.useEffect(() => {
    // const response = await fetch("http://localhost:3001/todos");
    // const todos = await response.json();
    const email = sessionStorage.getItem("user");
    const data = { email: email };
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/getTodos", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        const responseJSON = JSON.parse(response);
        if (responseJSON.status === "success") {
          delete responseJSON.status;
          delete responseJSON.email;
          delete responseJSON._id;
          console.log(responseJSON);
          // convert object to array
          const arr = Object.keys(responseJSON).map((key) => responseJSON[key]);
          console.log(arr);
          setTodoItems(arr);
        }
      }
    };
  }, []);

  const addItem = () => {
    setTodoItems([...todoItems, { id: todoItems.length + 1, text: `Item ${todoItems.length + 1}`, completed: false }]);
  };

  const removeItem = (id) => {
    setTodoItems(todoItems.filter((item) => item.id !== id));
    const email = sessionStorage.getItem("user");
    const data = { email: email, todo: { id: id } };
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/deleteTodo", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        const responseJSON = JSON.parse(response);
        if (responseJSON.status === "todo deleted") {
          console.log("deleted");
        }
      }
    };
  };

  const handleItemClick = (index) => {
    setTodoItems(
      todoItems.map((item, i) => {
        if (i === index) {
          return { ...item, editing: true };
        }
        return { ...item, editing: false };
      })
    );
  };

  // need to add an if statement that checks if the todo already exists and needs to be updated instead
  // of adding a new one every time.
  // could be implemented by checking if the todo value is the default one -> then add a new one to db
  // and if not default value that means it has already been added to db and needs to be updated
  const handleSave = (index, value) => {
    const email = sessionStorage.getItem("user");
    const doc = {
      email: email,
      todo: todoItems[index],
    };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/todos", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(doc));

    setTodoItems(
      todoItems.map((item, i) => {
        if (i === index) {
          return { ...item, text: item.inputValue, editing: false };
        }
        return item;
      })
    );
  };

  const handleCheckboxChange = (index) => {
    setTodoItems(
      todoItems.map((item, i) => {
        if (i === index) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  };
  return (
    <div>
      <button className="add_button" onClick={addItem}>
        Add Note
      </button>
      <div className="sticky_notes_div">
        <div className="todo-div">
          <ul className="bulleted_list">
            {todoItems.map((item, index) => (
              <li className="todo-item" key={item.id}>
                <input className="checkbox" type="checkbox" checked={item.completed} onChange={() => handleCheckboxChange(index)} />
                <img className="trash" src={trash} alt="trash" onClick={() => removeItem(item.id)} />
                {item.editing ? (
                  <input
                    value={item.inputValue}
                    onChange={(event) => {
                      const updatedTodo = todoItems.map((todo, i) => {
                        if (i === index) {
                          return { ...todo, inputValue: event.target.value };
                        }
                        return todo;
                      });
                      setTodoItems(updatedTodo);
                    }}
                    onBlur={(event) => handleSave(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSave(index, event.target.value);
                      }
                    }}
                  />
                ) : (
                  <span className={`todo-text ${item.completed ? "completed" : ""}`} onClick={() => handleItemClick(index)}>
                    {item.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* <ul>
      {todoItems.map((item) => (
        <div className="todo-div">
          <li className="todo-item" key={item.id}>
            <input className="checkbox" type="checkbox" checked={item.completed} onChange={() => removeItem(item.id)} />
            <label>{item.text}</label>
          </li>
        </div>
      ))}
    </ul> */}
      </div>
    </div>
  );
}

export default TodoNotes;
