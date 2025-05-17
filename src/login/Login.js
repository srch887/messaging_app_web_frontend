import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";

const Login = () => {
    const [userLogin, SetUserLogin] = useState({
        user: '',
        password: ''
    })

    const navigate = useNavigate();

    function textChangeHandler(e) {
        let { name, value } = e.target
        SetUserLogin((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/login`, 
            { email: userLogin.user, password: userLogin.password },
            { withCredentials: true }
        ).then(async (res) => {
            sessionStorage.setItem(
                'userDetails',
                JSON.stringify(res?.data?.result)
            )
            navigate('/messenger');
        }).catch(async (error) => {
            console.log(error)
            if (error?.status === 400) {
                alert(error?.response?.data?.message)
            }
            else {
                alert('Server error')
            }
        })

    };

    useEffect(() => {
        Cookies.remove('access_token')
    }, [])

    return (
        <>
            <h1>Public Messaging Board</h1>

            <h4>Login</h4>

            <form className='login-form' onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Email'
                    name='user'
                    value={userLogin.user}
                    onChange={textChangeHandler}
                />

                <input
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={userLogin.password}
                    onChange={textChangeHandler}
                />

                <input type="submit" />
            </form>

            <div className="signup" onClick={() => navigate('/signup')}>Sign-up</div>
        </>
    )
}

export default Login