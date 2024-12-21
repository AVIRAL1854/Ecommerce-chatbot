import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import axios from "axios";

// Function to beautify the bot response
const beautifyText = (text: string) => {
  // Make text inside ** bold
  const boldText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert newlines to paragraph breaks
  const paragraphs = boldText
    .split("\n")
    .map((paragraph) => `<p class="mb-2">${paragraph}</p>`)
    .join("");

  // Convert lists indicated by lines starting with - or * to actual lists
  const listItems = paragraphs.split("\n").map((line) => {
    if (line.startsWith("-") || line.startsWith("*")) {
      return `<li class="ml-5 list-disc">${line.slice(1).trim()}</li>`;
    }
    return line;
  });

  const list = `<ul class="list-inside">${listItems.join("")}</ul>`;

  return list || paragraphs;
};

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot"; timestamp: string }[]
  >([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const formatTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hello! Welcome to our store. How can I assist you today?",
          sender: "bot",
          timestamp: formatTime(),
        },
      ]);
    }
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { text: message, sender: "user", timestamp: formatTime() },
    ]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8000/api/v1/chatbot/",
        {
          message: message,
          session_id: sessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!sessionId) {
        setSessionId(response.data.session_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          text: beautifyText(response.data.bot_response),
          sender: "bot",
          timestamp: formatTime(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "bot",
          timestamp: formatTime(),
        },
      ]);
      console.error("Chatbot API Error:", error);
    }

    setIsLoading(false);
    setMessage("");
  };

  const resetChat = () => {
    setMessages([
      {
        text: "Hello! Welcome to our store. How can I assist you today?",
        sender: "bot",
        timestamp: formatTime(),
      },
    ]);
    setSessionId(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-0 right-0 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-16 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
            <div className="bg-white p-2 rounded-full">
              <MessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-3 text-white font-medium">
              Shopping Assistant
            </div>
            <button
              onClick={resetChat}
              className="absolute top-4 right-4 p-2 bg-grey-500 text-white rounded-full shadow-md hover:bg-white hover:text-blue-600"
            >
              Reset
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white ml-10"
                        : "bg-gray-200 text-gray-900 mr-10"
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-100 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Chatbot };
