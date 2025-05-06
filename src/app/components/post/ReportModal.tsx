'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const categories = ['Spam', 'Nudity', 'Violence', 'Hate speech', 'Misinformation'];

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [submitted, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-black p-6 rounded-xl shadow-xl w-[90%] max-w-md relative animate-fade-in"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Report Post</h2>

        <p className="text-gray-700 text-sm mb-4">
          This reporting system is <strong>not actually functional</strong>. It&apos;s just a visual
          mockup for demonstration purposes.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Tell us more..."
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <button
          onClick={() => setSubmitted(true)}
          className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition"
          disabled={!category}
        >
          Submit Report
        </button>

        {submitted && (
          <p className="mt-4 text-green-600 text-sm text-center animate-fade-in">
            Report submitted!
          </p>
        )}
      </div>
    </div>
  );
}
