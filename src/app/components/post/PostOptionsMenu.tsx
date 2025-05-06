'use client';

import { EllipsisVertical } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import AddToCollectionModal from '../collections/AddToCollectionModal';
import ReportModal from './ReportModal';
import EditPostModal from './EditPostModal';
import { usePathname, useRouter } from 'next/navigation';
import { deletePost } from '@/app/api/actions/posts/deletePost';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface PostOptionsMenuProps {
  authorId: string;
  postId: string;
  postTitle: string;
  currentTags: string[];
}

export default function PostOptionsMenu({
  authorId,
  postId,
  postTitle,
  currentTags,
}: PostOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isAuthor = session?.user?.id === authorId;
  const isOnPostPage = pathname.startsWith('/post/');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteConfirmed = async () => {
    setShowDeleteModal(false);
    const result = await deletePost(postId);

    if (!result.success) {
      alert(result.error || 'Failed to delete post.');
      return;
    }

    if (isOnPostPage) {
      router.push('/feed');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:text-sky-400 duration-300 transition-all"
      >
        <EllipsisVertical />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
              onClick={() => setShowCollectionModal(true)}
            >
              Add To Collection
            </li>
            {showCollectionModal && (
              <AddToCollectionModal
                postId={postId}
                onClose={() => setShowCollectionModal(false)}
              />
            )}

            {!isAuthor && (
              <>
                <li
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                  onClick={() => setShowReportModal(true)}
                >
                  Report
                </li>
                {showReportModal && (
                  <ReportModal onClose={() => setShowReportModal(false)} />
                )}
              </>
            )}

            {isAuthor && (
              <>
                <li
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer text-red-600"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </li>
                {showEditModal && (
                  <EditPostModal
                    postId={postId}
                    currentTitle={postTitle}
                    currentTags={currentTags}
                    onClose={() => setShowEditModal(false)}
                  />
                )}
              </>
            )}
          </ul>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}
