'use client';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({ onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-white text-sky-900 rounded-xl p-6 shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">Delete Post?</h2>
        <p className="text-sm mb-4">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
