// src/utils/chatContext.js
export class ConversationContext {
    constructor(maxSize = 10) {
      this.messages = [];
      this.maxSize = maxSize;
    }
  
    addMessage(message, response, section = null) {
      this.messages.push({
        userMessage: message,
        assistantResponse: response,
        section,
        timestamp: new Date()
      });
  
      // Keep context size manageable
      if (this.messages.length > this.maxSize) {
        this.messages.shift();
      }
    }
  
    getContext() {
      return this.messages;
    }
  
    clear() {
      this.messages = [];
    }
  }