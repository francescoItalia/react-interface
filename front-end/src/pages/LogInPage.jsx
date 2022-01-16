import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';

export const LogInPage = () => {
    const [token, setToken] = useToken();
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const onLoginClicked = async () => {
        try {
            const response = await fetch('/api/user/login',{
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
            <h1>Log In</h1>
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
                placeholder="Your Password here"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
            />
            <hr />
            <button 
                disabled={!email || !password} 
                onClick={onLoginClicked}>Log In</button>
            <button onClick={()=>history.push('/forgot-password')}>I Forgot My password</button>
            <button onClick={()=>history.push('/signup')}>New to the site? Sign Up!</button>
        </div>
    )
}
