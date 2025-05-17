import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Signup.css"

const Signup = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        username: '',
        password: ''
    })

    const navigate = useNavigate();

    function textChangeHandler(e) {
        let { name, value } = e.target
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/signup`, 
            { email: userInfo.email, username: userInfo.username, password: userInfo.password },
            { withCredentials: true }
        ).then(async (res) => {
            alert('User registered successfully!')
            navigate('/')
        }).catch(async (error) => {
            console.log(error)
            if (error?.status === 409) {
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

            <h4>Sign Up</h4>

            <form className='signup-form' onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Email'
                    name='email'
                    value={userInfo.email}
                    onChange={textChangeHandler}
                />

                <input
                    type='text'
                    placeholder='Username'
                    name='username'
                    value={userInfo.username}
                    onChange={textChangeHandler}
                />

                <input
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={userInfo.password}
                    onChange={textChangeHandler}
                />

                <input type="submit" />
            </form>
        </>
    )
}

export default Signup