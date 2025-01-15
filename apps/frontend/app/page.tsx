"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      // Log the response status
      console.log("Response status:", res.status);

      // Try to get the error message from the response
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.detail || `HTTP error! status: ${res.status}`);
      }

      setResponse(data.response);
    } catch (error) {
      console.error("Detailed error:", error);
      setResponse(`Lỗi: ${error.message || "Không thể kết nối đến máy chủ"}`);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Hỏi Đáp về Đền Pantheon</h1>
        <p className="text-gray-600">
          Hãy đặt câu hỏi về đền Pantheon, chúng tôi sẽ giải đáp ngay!
        </p>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 mb-4 min-h-[300px]">
          {response ? (
            <div className="whitespace-pre-wrap">{response}</div>
          ) : (
            <div className="text-gray-400 text-center mt-20">
              Câu trả lời sẽ xuất hiện ở đây
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? "Đang xử lý..." : "Gửi"}
          </button>
        </form>
      </main>

      <footer className="mt-8 text-center text-gray-600 text-sm">
        <p>
          Developed by{" "}
          <a
            href="https://github.com/yourusername/pantheus"
            className="text-blue-600 hover:underline"
          >
            Your Name
          </a>
        </p>
      </footer>
    </div>
  );
}
