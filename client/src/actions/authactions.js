import { GET_ERRORS, SET_CURRENT_USER } from './types'
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

//Register user
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

//Login get Token
export const loginUser = (userData) => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            //save to localstorage
            const { token } = res.data
            //set token to ls
            localStorage.setItem('jwtToken', token);
            //set token to auth header
            setAuthToken(token);
            //decode token get user data
            const decoded =jwt_decode(token);
            //set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
        }));
}


//set user
export const setCurrentUser = (decoded) => {
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

//log out
export const logoutUser = () => dispatch => {
    //remove token
    localStorage.removeItem('jwtToken');
    //remove auth header
    setAuthToken(false);
    //set current user to {}
    dispatch(setCurrentUser({}));
}