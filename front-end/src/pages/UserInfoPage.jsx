import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import { usePrevious } from '../customHooks/usePrevious';

export const UserInfoPage = () => {
    const history = useHistory();

    const user = useUser();
    const [token, setToken] = useToken();

    const { _id, email, info } = user;

    const [favouriteFood, setFavouriteFood] = useState(info.favouriteFood || '');
    const [hairColour, setHairColour] = useState(info.hairColour || '');
    const [bio, setBio] = useState(info.bio || '');
    const prevState = usePrevious({favouriteFood,hairColour,bio});

    // These state variables control whether or not we show
    // the success and error message sections after network requests.
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    // This useEffect hook automatically hides the
    // success and error messages after 3 seconds when they're shown.
    useEffect(() => {
        if (successMessage || errorMessage) {
            setTimeout(() => {
                setSuccessMessage(false);
                setErrorMessage(false);
            }, 3000);
        }
    }, [successMessage, errorMessage]);

    const saveChanges = async () => {
        // If no changes to the info, do not make the network request
        if(
            prevState.favouriteFood === favouriteFood &&
            prevState.hairColour === hairColour &&
            prevState.bio === bio
        ) return;
        // If no changes from the current
        try {
            const response = await fetch(`/api/user/${_id}`,
            {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    favouriteFood,
                    hairColour,
                    bio
                })
            });
            
            if(response.status === 200) {
                const { token: newToken } = await response.json();
                // Set the new Token
                setToken(newToken);
                setSuccessMessage(true);
            } else {
                setErrorMessage(true)
            }
        } catch(err) {
            console.log(err.message);
            setErrorMessage(true)
        }
    }

    const logOut = () => {
        // Delete Token form local storage
        // and send them to the "login page"
        localStorage.removeItem('token');
        history.push('/login');
    }
    
    const resetValues = () => {
        // Reset the text input values to
        // the the data loaded from the server
        setFavouriteFood('');
        setHairColour('');
        setBio('');
    }
    
    return (
        <div className="content-container">
            <h1>Info for {email}</h1>
            {successMessage && <div className="success">Successfully saved user data!</div>}
            {errorMessage && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
            <label>
                Favourite Food:
                <input
                    onChange={e => setFavouriteFood(e.target.value)}
                    value={favouriteFood} />
            </label>
            <label>
                Hair Color:
                <input
                    onChange={e => setHairColour(e.target.value)}
                    value={hairColour} />
            </label>
            <label>
                Bio:
                <input
                    onChange={e => setBio(e.target.value)}
                    value={bio} />
            </label>
            <hr />
            <button disabled={!favouriteFood && !hairColour && !bio} onClick={saveChanges}>Save Changes</button>
            <button onClick={resetValues}>Reset Values</button>
            <button onClick={logOut}>Log Out</button>
        </div>
    );
}