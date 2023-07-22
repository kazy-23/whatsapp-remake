import { signInWithRedirect } from 'firebase/auth'
import React from 'react'
import { auth, provider } from '../firebase'

function Signup() {
    const login = ()=>{
        signInWithRedirect(auth, provider);
    }

    return (
        <div className='container'>
            <div>
                <h1>Login</h1>
                <div className='button' onClick={login}>Login with google</div>
            </div>
        </div>
    )
}

export default Signup