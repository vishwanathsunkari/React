import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-bb-app.firebaseio.com/'
})

export default instance;