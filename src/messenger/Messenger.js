import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import './Messenger.css';

const socket = io(process.env.REACT_APP_BASE_URL);

const Messenger = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userInfo, setUserInfo] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        const authenticateAndFetch = async () => {
            try {
                // Authenticate user
                await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/api/authenticate`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('access_token')}`,
                        },
                        withCredentials: true,
                    }
                );

                // Fetch initial messages
                fetchMessages();

                setUserInfo(JSON.parse(sessionStorage.getItem('userDetails')))

                // Listen for new messages via WebSocket
                socket.on("newMessage", (message) => {
                    setMessages((prevMessages) => [message, ...prevMessages]);
                });
            } catch (error) {
                alert('Unauthorized access');
                console.error(error); // Log the error for debugging
                navigate('/'); // Redirect to the home page on error
            }
        };

        authenticateAndFetch();

        // Cleanup WebSocket listener on component unmount
        return () => {
            socket.off("newMessage");
        };
    }, []); // Empty dependency array ensures this runs once when the component mounts


    const fetchMessages = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/messages`);
        setMessages(response.data);
    };

    const postMessage = async () => {
        if (newMessage.trim()) {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/messages`, { email: userInfo?.email, username: userInfo?.username, message: newMessage });
            setNewMessage("");
        }
    };

    return (
        <div className="messaging-board">
            <h1 className="messaging-board_heading">Public Messaging Board</h1>
            <ul className="messaging-board_message-list">
                {messages.map((msg) => (
                    <li key={msg.id} className={ msg.username === Cookies.get('username') ? 'msg_user' : 'msg_other' } >{msg.username} : {msg.date_time} : {msg.message}</li>
                ))}
            </ul>
            <div className="messaging-board_form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message"
                />
                <button onClick={postMessage}>Post</button>
            </div>
        </div>
    );
};

export default Messenger;