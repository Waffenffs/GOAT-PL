import { useEffect, useState } from "react"
import { firebaseConfig } from "./firebaseConfig"
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import {GiRamProfile} from 'react-icons/gi'
import {CgProfile} from 'react-icons/cg'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'
import './App.css'

// initialize firebase
const app = initializeApp(firebaseConfig)

// initialize firebase auth
const auth = getAuth(app)

export default function App(){
  
  /* 
    ####################
    ||     TO-DOS     ||
    ####################

    1. Handle populating the database with each todos
      - modify documents everytime active is changed by user

  */

  const [user, setUser] = useState(false)
  const [userData, setUserData] = useState(null)
  const [signInEmail, setSignInEmail] = useState('') 
  const [signInPassword, setSignInPassword] = useState('')
  const [deleteToDos, setDeleteToDos] = useState(false)
  // checkbox states
  const [allChecked, setAllChecked] = useState(true)
  const [activeChecked, setActiveChecked] = useState(false)
  const [completedChecked, setCompletedChecked] = useState(false)
  // hold the values for the todo input
  const [todoInput, setTodoInput] = useState('')
  // todo state
  const [toDos, setToDos] = useState([{
    id: 1,
    title: 'Auto-Generated Task',
    description: 'This is an auto-generated task. You may edit it or remove it to your liking. Have fun.',
    active: true,
  }])

  // todos state initilization
  useEffect(() => {
    setToDos(JSON.parse(localStorage.getItem('todos')) || [{
      id: 1,
      title: 'Auto-Generated Task',
      description: 'This is an auto-generated task. You may edit it or remove it to your liking. Have fun.',
      active: true,
    }])
  }, [])

  // update todos in localstorage everytime change happens
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(toDos))
  }, [toDos])

  // check if user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) { 
        setUser(true)
        setUserData({
          email: user.email,
          uid: user.uid,
        })

       }
    })
  }, [])
  
  // change active state of todo
  const changeActiveState = (key) => {
    const newTodos = toDos.map((todo) => {
      if(todo.id === key){
        return {...todo, active: !todo.active, changed: !todo.changed}
      }
      return todo
    })

    setToDos(newTodos)
  }

  // delete todos from button click
  const deleteToDo = (id) => {
    const filteredToDos = toDos.filter((todo) => todo.id !== id)
    setToDos(filteredToDos)
  }

  // render todo elements on the page.
  const toDoElements = toDos.map((todo) => {
    // determine if to display todo
    const displayComponent = () => {
      if(!allChecked){
        if(activeChecked === false && todo.active){
          return 'none'
        }
        if(completedChecked === false && todo.active === false){
          return 'none'
        }
      }
    }

    return(
      <>
        <motion.div 
          className="todoContainer" 
          style={{display: displayComponent()}}
          initial={{ scale : 0 }}
          animate={{ scale : 1}}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          {deleteToDos && 
             <button className="deletion" onClick={() => deleteToDo(todo.id)}>DELETE</button>
          }
          <div className="todoTitleContainer"><h1 className="todoTitle">{todo.title}</h1></div>
          {todo.active ? <div className="todoTag" onClick={() => changeActiveState(todo.id)}>active</div> 
          : <div className="todoTag completed" onClick={() => changeActiveState(todo.id)}>completed</div>}
        </motion.div>
      </>
    )
  })

  // add a todo task to the state
  const createToDo = () => {
    if(todoInput){
      const toDoObject = {
        id: nanoid(),
        title: todoInput,
        description: 'This is an auto-generated task. You may edit it or remove it to your liking. Have fun.',
        active: true,
        changed: false,
      }

      setToDos(prevArray => [...prevArray, toDoObject])
      setTodoInput('')
    }
  }

  // conditionally render delete buttons on click
  const enableDeletion = () => {
    setDeleteToDos(prevState => !prevState)
  }

  // handle checkboxes
  const handleCheckbox = (val) => {
    switch(val){
      case 'active':
        setActiveChecked(prevState => !prevState)
        break;
      case 'all':
        setAllChecked(prevState => !prevState)
        break;
      case 'completed':
        setCompletedChecked(prevState => !prevState)
        break;
    }
  }

  return(
    <div className={!user ? 'loginPage' : ''}>
      {!user &&       
      
      <div className="pageContainer">
        <form onSubmit={(e) => {
          e.preventDefault()

          signInWithEmailAndPassword(auth, signInEmail, signInPassword)
            .catch((error) => console.log('Error logging in: ' + error))
        }}>
          <div>
            <h1>Email</h1>
            <input 
              type="email" 
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              placeholder="Email..."
              className="inputContainer"
            />
          </div>
          <div>
            <h1>Password</h1>
            <input 
              type="password" 
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              placeholder="Password..."
              className="inputContainer"
            />
          </div>
          <button>Login</button>
          <p>Don't have an account? <span className="p-register">Register</span> now!</p>
        </form>
      </div> 
      
      }

      {user &&
      <>
        <nav>
          <GiRamProfile  className="goat-icon"/>
          <h3>GOAT-PL</h3>
          <span className="welcome">{userData.email}</span>
          <CgProfile className="profile-icon" />
        </nav>

        <main>
          <div className="sectionContainer">
            <div className="select All">
              <input 
              type="checkbox" 
              className="checkbox-style"
              checked={allChecked}
              onChange={() => handleCheckbox('all')}
              />
              All
            </div>
            <div className="select Active">
              <input 
              type="checkbox" 
              className="checkbox-style"
              checked={activeChecked}
              onChange={() => handleCheckbox('active')}
              />
              Active
            </div>
            <div className="select Completed">
              <input 
              type="checkbox" 
              className="checkbox-style"
              checked={completedChecked}
              onChange={() => handleCheckbox('completed')}
              />
              Completed
            </div>
          </div>
          
          <div className="taskContainer">
            <div className="taskNav">
              <input 
                type="text"
                placeholder="Write something here..."
                className="todo-input"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
              />
              <div className="buttonContainer">
                <button className="addToDo" onClick={createToDo}>+</button>
                <button className="deleteToDo" onClick={enableDeletion}>-</button>
              </div>
            </div>

            <div className="todo-box">
              {toDoElements}
            </div>
          </div>
        </main>
      </>
      }
    </div>
  )
}