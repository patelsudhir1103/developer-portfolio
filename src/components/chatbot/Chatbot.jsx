import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faPaperPlane,
  faTimes,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am Sudhir's AI Assistant. How can I help you today? Ask me about my skills, projects, or work availability!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput("");

    // Add user message
    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Sorry, I am having trouble connecting right now.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.error("Chatbot response error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I couldn't reach the server. Let's discuss your project directly using the contact form below!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const quickPrompts = [
    "What are your skills?",
    "Show me your projects",
    "Are you open to hire?",
    "Where are you based?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-circle bg-picto-primary hover:bg-picto-primary-dark border-0 shadow-2xl text-white w-14 h-14 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
          title="Chat with AI"
        >
          <FontAwesomeIcon icon={faRobot} className="text-2xl" />
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[340px] xs:w-[380px] h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-picto-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FontAwesomeIcon icon={faRobot} className="text-xl" />
              </div>
              <div>
                <p className="font-semibold text-sm">Patel Sudhir's Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] text-white/80">AI Agent Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>

          {/* Messages Console */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-950/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.sender === "user"
                      ? "bg-picto-primary text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-800 rounded-tl-none"
                  } shadow-sm`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl rounded-tl-none p-3 border border-gray-100 dark:border-gray-800 flex items-center gap-1.5 shadow-sm">
                  <FontAwesomeIcon icon={faCommentDots} className="animate-bounce" />
                  <span className="text-xs">Agent is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions panel */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-white dark:bg-gray-800 hover:bg-picto-primary hover:text-white text-picto-primary dark:text-picto-primary border border-picto-primary/20 hover:border-picto-primary rounded-full px-3 py-1 cursor-pointer transition-colors duration-250"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Message input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Sudhir..."
              className="flex-1 input input-bordered input-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none text-sm rounded-xl py-1.5 text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn btn-sm btn-circle bg-picto-primary hover:bg-picto-primary-dark border-0 text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
