import { useState, useEffect } from 'react';
import { Template, TodoList, TodoInsert } from './components';
import { MdAddCircle } from 'react-icons/md';
import './App.css';

export default function App() {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [insertToggle, setInsertToggle] = useState(false);
  const [todos, setTodos] = useState([]); // Todo List 추가
  let nextId = todos.length;

  useEffect(() => {
    fetch('https://minix-api.github.io/api/todo-app/db.json')
      .then(res => {
        return res.json();
      })
      .then(data => {
        setTodos(data['todos']);
      });
  }, []);

  // Todo Item 추가
  function onInsertToggle() {
    if (selectedTodo) {
      setSelectedTodo(null);
    }
    setInsertToggle(prev => !prev);
  }

  function onInsertTodo(text) {
    if (text === '') {
      return alert('할 일을 입력해주세요.');
    } else {
      const todo = {
        id: nextId,
        text,
        checked: false,
      };
      setTodos(todos => todos.concat(todo));
      nextId++;
    }
  }

  function onCheckToggle(id) {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  }

  function onChangeSelectedTodo(todo) {
    setSelectedTodo(todo);
  }

  function onRemove(id) {
    onInsertToggle();
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }

  function onUpdate(id, text) {
    onInsertToggle();
    setTodos(todos =>
      todos.map(todo => (todo.id === id ? { ...todo, text } : todo))
    );
  }

  return (
    <Template todoLength={todos.length}>
      <TodoList
        todos={todos}
        onCheckToggle={onCheckToggle}
        onInsertToggle={onInsertToggle}
        onChangeSelectedTodo={onChangeSelectedTodo}
      />
      <div className="add-todo-btn" onClick={onInsertToggle}>
        <MdAddCircle />
      </div>
      {insertToggle && (
        <TodoInsert
          selectedTodo={selectedTodo}
          onInsertToggle={onInsertToggle}
          onInsertTodo={onInsertTodo}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      )}
    </Template>
  );
}
