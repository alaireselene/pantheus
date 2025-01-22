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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add auto-resize functionality for textarea
  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const shouldScroll =
        chatContainerRef.current.scrollHeight -
          chatContainerRef.current.scrollTop <=
        chatContainerRef.current.clientHeight + 100;
      if (shouldScroll) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isLoading]);

  // Handle iOS viewport height
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    <div className="fixed inset-0 flex bg-white dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
      <main className="relative flex-1 flex flex-col h-screen">
        {/* Mobile Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 md:hidden z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="font-semibold">Dự án Parthenos</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
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

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-36 space-y-6 scroll-smooth bg-white/50 dark:bg-gray-900/50"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-gray-700 dark:text-gray-300 mb-1 px-2 font-medium">
                {msg.sender === "user" ? "Bạn" : "Parthenos Project"}
              </span>
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 dark:bg-gray-800 rounded-tl-none text-gray-900 dark:text-gray-100"
                }`}
              >
                <div
                  className={
                    msg.sender === "bot"
                      ? "prose dark:prose-invert max-w-none"
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
                      ? "text-white/70"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-700 dark:text-gray-300 mb-1 px-2 font-medium">
                Parthenos Project
              </span>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 animate-pulse">
                <span className="text-gray-900 dark:text-gray-100">
                  Đang trả lời...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="absolute bottom-0 left-0 right-0 md:left-0 md:right-[480px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 w-full">
          <div className="max-w-4xl mx-auto w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex gap-2 items-stretch w-full">
              {" "}
              {/* Changed to items-stretch */}
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
                className="w-full min-h-[48px] p-3 bg-white dark:bg-gray-800 
                         border border-gray-200 dark:border-gray-700 rounded-lg 
                         placeholder-gray-500 dark:placeholder-gray-400
                         text-gray-900 dark:text-gray-100 resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  height: "48px", // Fixed initial height
                  maxHeight: "120px",
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleMessage}
                disabled={isLoading || !input.trim()}
                className="h-[48px] px-6 rounded-lg bg-blue-600 hover:bg-blue-700 
                         disabled:bg-gray-400 dark:disabled:bg-gray-700
                         text-white font-medium transition-all
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         active:scale-95 transform whitespace-nowrap"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 right-0 w-[480px] max-w-full 
                   bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800
                   text-gray-900 dark:text-gray-100
                   transform transition-transform duration-300 z-50
                   ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            <u>Dự án Parthenos</u>
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-5rem)] p-6 overscroll-contain">
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
            <h3 className="text-lg font-semibold mb-2">Nhóm tác giả</h3>
            <ul>
              <li>Nguyễn Trường Sinh - 10M</li>
              <li>Nguyễn Văn Thanh Hải - 10A</li>
              <li>Nguyễn Đức Lộc - 10A</li>
              <li>Vũ Phú Minh - 10A</li>
              <li>Trần Đặng Cường - 10A</li>
              <li>Trần Xuân Trường - 10A</li>
            </ul>
            <p>Học sinh trường THPT Cẩm Giàng - Hải Dương</p>
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

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
