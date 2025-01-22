"use client";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { ApiError } from "../types/error";
import { Message } from "../types/chat";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      content: "Xin chào! Tôi có thể giúp gì cho bạn về đền Parthenon?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Add auto-resize functionality for textarea
  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle iOS viewport height
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessage();
    }
  };

  const handleMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    try {
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setInput("");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new ApiError(
          "API request failed",
          res.status,
          data.detail || "Unknown error"
        );
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Không có phản hồi",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          error instanceof Error
            ? `Lỗi: ${error.message}`
            : "Đã xảy ra lỗi không xác định",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="fixed inset-0 flex bg-ancient-sage/30 dark:bg-ancient-dark-bg overflow-hidden"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <main className="flex-1 flex flex-col h-full p-4 border-r border-ancient-brown/20 dark:border-ancient-dark-border">
        <div
          className="flex-1 overflow-y-auto space-y-6 mb-4 scrollbar-thin scrollbar-thumb-ancient-beaver 
                      dark:scrollbar-thumb-ancient-dark-border scrollbar-track-ancient-sage/30 
                      overscroll-contain"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-ancient-text dark:text-ancient-dark-text mb-1 px-2 font-medium">
                {msg.sender === "user" ? "Bạn" : "Parthenos Project"}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === "user"
                    ? "bg-ancient-azure text-white rounded-tr-none"
                    : "bg-ancient-yellow/10 dark:bg-ancient-dark-surface/50 shadow-md rounded-tl-none border border-ancient-yellow/20 dark:border-ancient-dark-border"
                }`}
              >
                <div
                  className={
                    msg.sender === "bot"
                      ? "prose prose-ancient max-w-none"
                      : "whitespace-pre-wrap"
                  }
                >
                  {msg.sender === "bot" ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
                <div
                  className={`text-[10px] mt-1 ${
                    msg.sender === "user"
                      ? "text-white/70" // Keep white for user messages since they're on blue background
                      : "text-ancient-text-secondary dark:text-ancient-dark-text-secondary"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <span className="text-xs text-ancient-text dark:text-ancient-dark-text mb-1 px-2 font-medium">
                Parthenos Project
              </span>
              <div className="bg-ancient-yellow/10 dark:bg-ancient-dark-surface/50 rounded-2xl rounded-tl-none px-4 py-2.5 animate-pulse text-ancient-text-secondary dark:text-ancient-dark-text-secondary">
                Đang trả lời...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 bg-ancient-yellow/10 p-4 rounded-lg shadow-md border border-ancient-yellow/20 sticky bottom-0">
          <textarea
            ref={textAreaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextAreaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 p-2 border border-ancient-brown/20 rounded-lg bg-white/50 
                     focus:outline-none focus:ring-2 focus:ring-ancient-azure/50 
                     resize-none overflow-hidden"
            style={{
              minHeight: "42px",
              maxHeight: "120px", // Reduced for better iOS experience
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleMessage}
            type="button"
            disabled={isLoading || !input.trim()}
            className="bg-ancient-azure text-white px-6 py-2 rounded-lg hover:bg-ancient-azure/90 disabled:bg-ancient-beaver transition-colors"
          >
            Gửi
          </button>
        </div>
      </main>

      <aside
        className="w-[480px] h-full flex flex-col bg-ancient-yellow/10 
                      dark:bg-ancient-dark-surface shadow-inner overflow-y-auto 
                      border-l border-ancient-brown/20 dark:border-ancient-dark-border 
                      overscroll-contain"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-ancient-brown/20 dark:border-ancient-dark-border">
          <span className="text-3xl font-bold text-ancient-gold">
            <u>Dự án Parthenos</u>
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-ancient-sage/20 dark:hover:bg-ancient-dark-border"
            >
              {theme === "dark" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <a
              href="https://github.com/alaireselene/pantheus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex-1 p-6 prose prose-ancient">
          <div className="mb-6">
            <p>
              <b>
                <i>Parthenos</i>
              </b>{" "}
              là một dự án giúp học sinh tìm hiểu lịch sử dễ dàng hơn thông qua
              sự hỗ trợ của AI. Dự án tập trung vào việc giải đáp các thắc mắc
              về đền Parthenon - một công trình kiến trúc mang tính biểu tượng
              của La Mã cổ đại.
            </p>
            <p>
              Dự án được phát triển cho Cuộc thi Khoa học Kỹ thuật cấp Tỉnh với
              mục tiêu ứng dụng công nghệ vào việc học tập lịch sử.
            </p>
            <p>
              Dự án có sự hỗ trợ của <b>Claude 3.5 Sonnet</b>, một mô hình ngôn
              ngữ có khả năng coding siêu việt.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Thông tin tác giả</h3>
            <p className="mb-1">
              Nguyễn Trường Sinh, Học sinh lớp 10M, Trường THPT Cẩm Giàng - Hải
              Dương
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Công nghệ sử dụng</h3>
            <ul>
              <li>Mô hình ngôn ngữ: ChatGPT 4o-mini</li>
              <li>Frontend: NextJS + TailwindCSS</li>
              <li>Backend: FastAPI</li>
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">
              © 2024 Parthenos Project - Học Lịch Sử Cùng AI
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
