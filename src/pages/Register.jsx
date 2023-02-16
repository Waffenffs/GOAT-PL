import '../App.css'
import { app, auth } from './Home'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const navigation = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(registerEmail && registerPassword){
            createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
                .then((user) => {
                    console.log('user created')
                    navigation(-1)
                })
        }
    }

    return(
        <div className='registerPageContainer'>
            <div className="pageContainer">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                    <h1>Email</h1>
                    <input 
                        type="email" 
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="Email..."
                        className="inputContainer"
                    />
                    </div>
                    <div>
                    <h1>Password</h1>
                    <input 
                        type="password" 
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Password..."
                        className="inputContainer"
                    />
                    </div>
                    <button>Register</button>
                </form>
            </div> 
        </div>
    )
}