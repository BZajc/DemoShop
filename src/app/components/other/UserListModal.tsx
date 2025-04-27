'use client';

import { useEffect, useState } from 'react';
import { getOnlineContactsPaginated } from '@/app/api/actions/contacts/getOnlineContactsPaginated';
import Image from 'next/image';
import { X, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  avatarPhoto: string | null;
  hashtag: string | null;
}

interface Props {
  onClose: () => void;
}

export default function UserListModal({ onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const data = await getOnlineContactsPaginated(page);
    setUsers((prev) => {
      const existingIds = new Set(prev.map((u) => u.id));
      const newUniqueUsers = data.filter((u) => !existingIds.has(u.id));
      return [...prev, ...newUniqueUsers];
    });
    setPage((prev) => prev + 1);
    if (data.length < 20) setHasMore(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.hashtag?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative animate-fade-in"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold text-sky-900 mb-4">Online Users</h2>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md text-sm"
        />

        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {user.avatarPhoto ? (
                    <Image
                      src={user.avatarPhoto}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      ?
                    </div>
                  )}
                </div>
                <span className="text-sky-900 font-medium">@{user.name}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/profile/${user.name}/${user.hashtag}`)
                  }
                  className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded transition"
                >
                  Go to profile
                </button>

                <button
                  onClick={() =>
                    router.push(`/contacts/${user.name}/${user.hashtag}`)
                  }
                  className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 px-2.5 py-1 rounded transition flex items-center gap-1"
                >
                  <MessageCircle size={14} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="text-sm px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
            >
              {loading ? 'Loading...' : 'Show more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
