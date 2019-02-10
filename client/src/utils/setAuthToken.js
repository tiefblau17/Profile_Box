import axios from 'axios';

const setAuthToken = (token) => {
    if(token){
        axios.defaults.headers.common['Authoriation'] = token;
    }
    else{
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;