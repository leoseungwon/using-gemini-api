import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000");

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        socket.on("aiMessage",(message)=> {
            setMessages((prevMessages)=>[...prevMessages,{text: message, sender: "AI"}]);
        });
        return () => {
            socket.off("aiMessage");
        }
    },[]);

    const sendMessage = () => {
        if(input.trim()==="") return;

        setMessages((prevMessages)=>[...prevMessages,{text: input, sender: "User"}]);
        socket.emit("userMessage",input);
        setInput("");
    };

    return (
        <div style={{
            width:"400px",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ddd",
        }}>
            <h2>Gemini AI Chat</h2>
            <div>
                {messages.map((msg,index)=>{
                    return (
                    <div key={index} style={{textAlign: msg.sender === "User" ? "right" : "left"}}>
                        <b>{msg.sender}:</b> {msg.text}
                    </div>
                    )
                })}
            </div>
            <input 
            type="text"
            value={input}
            onChange={((e)=>setInput(e.target.value))}
            style={{width:"80%", padding: "10px", marginTop: "10px"}}
            />
            <button onClick={sendMessage} style={{padding:"10px", marginLeft:"5px"}}>
                전송
            </button>
        </div>
    );
}

export default Chat;