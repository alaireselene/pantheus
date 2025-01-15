"use client";
import { useState } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { ApiError } from "../types/error";
import { Message } from "../types/chat";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      content: "Xin chào! Tôi có thể giúp gì cho bạn về đền Parthenon?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <div className="min-h-screen bg-ancient-sage/30 flex">
      <main className="flex-1 flex flex-col h-screen p-4 border-r border-ancient-brown/20">
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 scrollbar-thin scrollbar-thumb-ancient-beaver scrollbar-track-ancient-sage/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-ancient-brown mb-1 px-2 font-medium">
                {msg.sender === "user" ? "Bạn" : "Parthenos Project"}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === "user"
                    ? "bg-ancient-azure text-white rounded-tr-none"
                    : "bg-ancient-yellow/10 shadow-md rounded-tl-none border border-ancient-yellow/20"
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
                      ? "text-white/70"
                      : "text-ancient-brown/70"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <span className="text-xs text-ancient-brown mb-1 px-2 font-medium">
                Parthenos Project
              </span>
              <div className="bg-ancient-sage/30 rounded-2xl rounded-tl-none px-4 py-2.5 animate-pulse">
                Đang trả lời...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 bg-ancient-yellow/10 p-4 rounded-lg shadow-md border border-ancient-yellow/20"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 p-2 border border-ancient-brown/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-ancient-azure/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-ancient-azure text-white px-6 py-2 rounded-lg hover:bg-ancient-azure/90 disabled:bg-ancient-beaver transition-colors"
          >
            Gửi
          </button>
        </form>
      </main>

      <aside className="w-[480px] h-screen flex flex-col bg-ancient-yellow/10 shadow-inner overflow-y-auto border-l border-ancient-brown/20">
        <div className="flex items-center justify-between p-6 border-b border-ancient-brown/20">
          <span className="text-3xl font-bold text-ancient-gold">
            <u>Dự án Parthenos</u>
          </span>
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
