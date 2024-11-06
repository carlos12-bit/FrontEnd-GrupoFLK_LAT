<template>
  <div class="chat-widget">
    <div class="chat-header" @click="toggleChat">
      ChatBot
    </div>
    <div v-if="isChatOpen" class="chat-window">
      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.sender]">
          {{ msg.text }}
        </div>
      </div>
      <div class="input-container">
        <input
          class="chat-input"
          type="text"
          v-model="input"
          @keyup.enter="handleSend"
          placeholder="Escribe tu mensaje..."
        />
        <button class="send-button" @click="handleSend">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/geminis.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  data() {
    return {
      messages: [],
      input: '',
      isChatOpen: false
    };
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
    },
    async handleSend() {
      if (this.input.trim() === '') return;

      const userMessage = { sender: 'user', text: this.input };
      this.messages.push(userMessage);

      const genAI = new GoogleGenerativeAI(config.GoogleGenerativeAI.API_KEY);
      const model = genAI.getGenerativeModel({
        model: config.GoogleGenerativeAI.Model.Name,
      });

      const prompt = this.input;
      try {
        const result = await model.generateContent(prompt);
        const botMessage = { sender: 'bot', text: result.response.text() };
        this.messages.push(botMessage);
      } catch (error) {
        console.error("Error generating content:", error);
      }

      this.input = '';
    }
  }
};
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateY(calc(100% - 40px));
  z-index: 1000; /* Asegúrate de que el chatbot esté en la capa frontal */
}

.chatbot-container.expanded {
  transform: translateY(0);
}

.chat-header {
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  text-align: center;
}

.chat-content {
  padding: 10px;
}

.chat-window {
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  overflow-y: scroll;
  background-color: #fff;
}

.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
}

.message.user {
  text-align: right;
  background-color: #d1e7dd;
  color: #0f5132;
}

.message.bot {
  text-align: left;
  background-color: #f8d7da;
  color: #842029;
}

.input-container {
  display: flex;
  width: 100%;
  margin-top: 10px;
}

.chat-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>