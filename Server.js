require("dotenv").config();
const express = require("express");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin : "http://localhost:3000",
        methods: ["GET","POST"],
    },
});


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.use(cors());
app.use(express.json());

io.on("connection",(socket) => {
    console.log("새로운 사용자가 연결됨");

    socket.on("userMessage", async (message) => {
        try {
            const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
            const result = await model.generateContent(message);
            const response = await result.response;
            const text = response.text();
            console.log("AI 응답:",text);
            socket.emit("aiMessage",text);
        } catch(error) {
            console.error("Gemini API 호출 오류",error);
            socket.emit("aiMessage","AI 응답을 가져오는데 문제가 발생했습니다.");
        }
    });

    socket.on("disconnect", () => {
        console.log("사용자가 연결을 해제함");
    })
});
server.listen(4000, () => {
    console.log("서버가 5000번 포트에서 실행중...");
})