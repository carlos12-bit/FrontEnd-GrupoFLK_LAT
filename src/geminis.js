// geminis.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = {
  GoogleGenerativeAI: {
    API_KEY: "AIzaSyDy9AkidGx2NbJb82X9TuHmfYMf-G9b9bs",
    Model: {
      Name: "gemini-1.5-flash",
      Type: "GenerativeModel"
    }
  }
};

const API_KEY = config.GoogleGenerativeAI.API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: config.GoogleGenerativeAI.Model.Name,
});

// Ejemplo de prompt para usar con el modelo "gemini"
const prompt = "Conéctame con el modelo gemini y genera contenido";

const result = await model.generateContent(prompt);
console.log(result.response.text());

export default config;