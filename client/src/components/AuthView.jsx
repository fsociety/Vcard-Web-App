import React,{ useState } from "react";
import Login from './../pages/Login';
import Register from './../pages/Register';

export default function AuthView() {
    const [authview, setAuthview] = useState('login');
    switch (authview) {
        case 'login':
        return <Login authView={setAuthview} />
        
        case 'register':
        return <Register authView={setAuthview} />

        default:
        return null
    }
}
