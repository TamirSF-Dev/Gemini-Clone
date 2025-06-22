class GeminiClone {
    constructor() {
        this.chatHistory = [];
        this.isLoading = false;
        this.initializeElements();
        this.bindEvents();
        this.adjustTextareaHeight();
    }

    initializeElements() {
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.suggestionCards = document.querySelectorAll('.suggestion-card');
    }

    bindEvents() {
        // Send button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter key press (Shift+Enter for new line)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input change to enable/disable send button
        this.messageInput.addEventListener('input', () => {
            this.toggleSendButton();
            this.adjustTextareaHeight();
        });

        // New chat button
        this.newChatBtn.addEventListener('click', () => this.startNewChat());

        // Suggestion cards
        this.suggestionCards.forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.getAttribute('data-prompt');
                this.messageInput.value = prompt;
                this.toggleSendButton();
                this.sendMessage();
            });
        });

        // Optional: Add attachment and microphone functionality
        document.getElementById('attachBtn').addEventListener('click', () => {
            this.showNotification('File attachment feature coming soon!');
        });

        document.getElementById('micBtn').addEventListener('click', () => {
            this.showNotification('Voice input feature coming soon!');
        });
    }

    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
    }

    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isLoading;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;

        // Hide welcome screen and show chat
        this.showChatInterface();

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input
        this.messageInput.value = '';
        this.toggleSendButton();
        this.adjustTextareaHeight();

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call (replace with actual API integration)
            const response = await this.callGoogleAI(message);
            this.addMessage(response, 'ai');
        } catch (error) {
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('API Error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    showChatInterface() {
        this.welcomeScreen.style.display = 'none';
        this.chatContainer.style.display = 'block';
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Simple markdown-like formatting
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;

        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Add to chat history
        this.chatHistory.push({ content, sender, timestamp: new Date() });
    }

    formatMessage(content) {
        // Basic formatting for better readability
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
            .replace(/\n/g, '<br>'); // Line breaks
    }

    /*async callAI(message) {
        // This is a mock implementation
        // Replace this with actual API integration (OpenAI, Google AI, etc.)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // Mock responses based on message content
        const responses = this.generateMockResponse(message);
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateMockResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('quantum computing')) {
            return [
                "Quantum computing is a revolutionary technology that uses quantum mechanical phenomena like superposition and entanglement to process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or 'qubits' that can exist in multiple states simultaneously.\n\nThis allows quantum computers to potentially solve certain problems exponentially faster than classical computers, particularly in areas like cryptography, optimization, and scientific simulation."
            ];
        }

        if (lowerMessage.includes('space exploration') || lowerMessage.includes('story')) {
            return [
                "**The Stellar Odyssey**\n\nCaptain Elena Rodriguez gazed through the viewport of the starship *Endeavor* as it approached Kepler-442b, humanity's first potentially habitable exoplanet destination. After a 20-year journey through the cosmos, her crew of 200 pioneers was about to make history.\n\nThe planet glowed with an ethereal blue-green hue, its twin moons casting dancing shadows across unfamiliar continents. As they prepared for landing, Elena couldn't help but wonder what mysteries awaited them on this new world—and whether they would find signs of life beyond Earth.\n\n*'Today, we take humanity's greatest leap,'* she thought, as the descent sequence began..."
            ];
        }

        if (lowerMessage.includes('meal') || lowerMessage.includes('healthy')) {
            return [
                "Here's a balanced weekly meal plan focusing on nutrition and variety:\n\n**Monday - Wednesday:**\n• Breakfast: Greek yogurt with berries and granola\n• Lunch: Quinoa salad with grilled chicken and vegetables\n• Dinner: Baked salmon with roasted sweet potatoes and broccoli\n\n**Thursday - Saturday:**\n• Breakfast: Oatmeal with banana and nuts\n• Lunch: Lentil soup with whole grain bread\n• Dinner: Stir-fried tofu with brown rice and mixed vegetables\n\n**Sunday:**\n• Breakfast: Vegetable omelet with whole grain toast\n• Lunch: Grilled chicken salad\n• Dinner: Lean beef with quinoa and steamed asparagus\n\n*Remember to stay hydrated and adjust portions based on your activity level!*"
            ];
        }

        if (lowerMessage.includes('web development') || lowerMessage.includes('trends')) {
            return [
                "Current web development trends shaping 2024-2025:\n\n**Frontend Innovations:**\n• **AI Integration**: AI-powered chatbots, content generation, and personalization\n• **WebAssembly (WASM)**: High-performance applications in browsers\n• **Progressive Web Apps (PWAs)**: Native-like experiences on web\n• **Micro-frontends**: Scalable architecture for large applications\n\n**Development Practices:**\n• **Serverless Architecture**: Focus on Functions-as-a-Service (FaaS)\n• **Edge Computing**: Faster content delivery and processing\n• **Low-code/No-code**: Democratizing web development\n• **Sustainable Web Design**: Energy-efficient, environmentally conscious development\n\n**Emerging Technologies:**\n• **Web3 Integration**: Blockchain and decentralized applications\n• **Extended Reality (XR)**: AR/VR experiences in browsers\n• **Advanced CSS**: Container queries, CSS Grid subgrid, and new layout methods"
            ];
        }

        // Default responses for general queries
        return [
            "That's an interesting question! I'd be happy to help you explore this topic further. Could you provide more specific details about what you'd like to know?",
            "I understand you're looking for information about this topic. Let me help you with a comprehensive response based on what you've asked.",
            "Great question! This is a topic I can definitely assist you with. Let me break this down for you in a clear and helpful way.",
            "I'm here to help! Based on your question, I can provide you with detailed insights and practical information.",
            "Thank you for your question. I'll do my best to provide you with accurate and useful information on this subject."
        ];
    }*/


    setLoadingState(loading) {
        this.isLoading = loading;
        this.loadingOverlay.style.display = loading ? 'flex' : 'none';
        this.toggleSendButton();
    }

    startNewChat() {
        this.chatHistory = [];
        this.chatMessages.innerHTML = '';
        this.welcomeScreen.style.display = 'flex';
        this.chatContainer.style.display = 'none';
        this.messageInput.value = '';
        this.toggleSendButton();
        this.adjustTextareaHeight();
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4285f4;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // API Integration Methods (to be implemented)
    async setupAPIKey() {
        // This method should handle API key setup
        // You can implement localStorage for API key storage or environment variables
        console.log('API setup required - implement your preferred AI service integration');
    }

    async callGoogleAI(message) {
        // Example Google AI integration (requires API key)
    
        const API_KEY = 'AIzaSyB6qi65gC8RICJn29gZMcFbPco5P1rDGDo';
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
        
    }

    async callOpenAI(message) {
        // Example OpenAI integration (requires API key)
        /*
        const API_KEY = 'your-openai-api-key';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                max_tokens: 500
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
        */
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GeminiClone();
});
