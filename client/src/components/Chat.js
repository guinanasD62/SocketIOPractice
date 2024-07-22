import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import styles from "./../css/Chat.module.css";
import ScrollToButtom from "react-scroll-to-bottom";

let socket;

const Chat = () => {
    const { search } = useLocation();
    const { name, room } = queryString.parse(search); // npm install --save query-string
    const [messages, setMessages] = useState([]);

    console.log(search);
    console.log(name, room);

    useEffect(() => {
        socket = io('http://localhost:3070');

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });

        socket.on("message", (message) => {
            setMessages((existingMsgs) => [...existingMsgs, message]);
        });

        return () => {
            socket.disconnect();
            socket.close();
        };
    }, [name, room]);

    const sendMessage = (e) => {
        if (e.key === "Enter" && e.target.value) {
            socket.emit('message', e.target.value);
            e.target.value = ""
        }
    };

    return (
        <><div className={styles.chat}>
            <div className={styles.chatHead}>
                <div className={styles.room}> Room: {room} </div>
                <Link to="/"> x </Link>

            </div>

            <div className={styles.chatSection}>
                <div className={styles.chatBox}>
                    <div className={styles.userList}>
                        <div>User Name</div>
                    </div>
                    <ScrollToButtom>
                        <div className={styles.messages}>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${name === message.user ? "self" : ""}`}
                                >
                                    <span className={styles.user}>{message.user}</span>:{" "}

                                    <span className={styles.messageText}>{message.text}</span>

                                </div>))}
                        </div>

                    </ScrollToButtom>
                    <input placeholder='message' onKeyDown={sendMessage} />

                </div >
            </div>
        </div >
        </>
    );
};

export default Chat;
