import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';

export const SignUpPage = () => {
    const [token, setToken] = useToken();
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory();

    const onLoginClicked = async () => {
        try {
            const response = await fetch('/api/user/signup',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
    
            if(response.status === 200) {
                const {token} = await response.json();
                setToken(token);
                history.push('/')
            } else {
                setErrorMessage(await response.text());
            } 
        } catch(err) {
            setErrorMessage(err.message);
        }   
    }

    // If the user is already logged in (a valid token exists)
    // redirect to the '/' page
    useEffect(()=>{
        if(token) history.push('/');
    },[token]);

    // Automatically hides the error message 
    // after 3 seconds when they're shown.
    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage(false);
            }, 3000);
        }
    }, [errorMessage]);

    return(
        <div className="content-container">
            <h1>Sign Up</h1>
            {errorMessage && <div className="fail">{errorMessage}</div>}
            <input 
                type="text" 
                placeholder="yourEmail@mail.com"
                pattern='/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
                value={email} 
                onChange={(e)=> setEmail(e.target.value)}    
            />
            <input 
                type="password"
                pattern="^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{7,15}$"
                placeholder="Your Password here"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
            />
            <input 
                type="password"
                pattern="^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{7,15}$"
                placeholder="Confirm here"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)} 
            />
            <hr />
            <div className="password-helper">
                <p className={password.match(/[a-zA-Z]/g) ? 'valid' : 'invalid'}>At least a <b>letter</b></p>
                <p className={password.match(/[!@#$%^&*]/g) ? 'valid' : 'invalid'}>At least a <b>Special Character</b></p>
                <p className={password.match(/[0-9]/g) ? 'valid' : 'invalid'}>At least a <b>number</b></p>
                <p className={password.match(/.{7,15}/) ? 'valid' : 'invalid'}>Between <b>7 and 15 characters</b></p>
                <p className={password === confirmPassword ? 'valid' : 'invalid'}>Password and Confirm Password <b>Match</b></p>
            </div>
            <hr />
            <button 
                disabled={
                    !email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) || 
                    password !== confirmPassword ||
                    !password.match(/^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{7,15}$/g)
                } 
                onClick={onLoginClicked}>Sign Up</button>
            <button onClick={()=>history.push('/login')}>Already a Member? Log In!</button>
        </div>
    )
}
