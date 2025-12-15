import React, { useState, useEffect } from 'react';
import styles from '../../css/PostMdal.module.css';
import { X, Edit, Trash2, Eye, EyeOff, Heart, MessageCircle, User, Calendar } from 'lucide-react';
import type { Post } from '../../types/post.type';

interface PostModalProps {
  mode: 'view' | 'edit' | 'create'; // Thêm 'create'
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  onDelete?: (postId: number) => Promise<void>;
  onToggleHide?: (postId: number) => Promise<void>;
  onLike?: (postId: number) => Promise<void>;
}

const PostModal: React.FC<PostModalProps> = ({
  mode,
  post,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onToggleHide,
  onLike
}) => {
  const [content, setContent] = useState(post?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
    } else {
      setContent('');
    }
  }, [post]);

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Nội dung không được để trống');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(content);
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Lỗi khi lưu bài viết');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {mode === 'view' ? 'Chi tiết bài viết' : 
             mode === 'edit' ? 'Chỉnh sửa bài viết' : 
             'Tạo bài viết mới'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* View Mode */}
        {mode === 'view' && post && (
          <div className={styles.postDetail}>
            <div className={styles.postAuthor}>
              <div className={styles.authorAvatar}>
                <User size={24} />
              </div>
              <div className={styles.authorInfo}>
                <h3>{post.authorFullName || post.authorUsername}</h3>
                <p className={styles.postTime}>
                  <Calendar size={14} />
                  {formatDate(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt && ' (Đã chỉnh sửa)'}
                </p>
              </div>
            </div>

            <div className={styles.postContent}>
              <p>{post.content}</p>
            </div>

            <div className={styles.postStats}>
              <div className={styles.statItem}>
                <Heart size={16} className={post.likedByCurrentUser ? styles.liked : ''} />
                <span>{post.likeCount} lượt thích</span>
              </div>
              <div className={styles.statItem}>
                <span>{post.hidden ? 'Đã ẩn' : 'Hiển thị'}</span>
              </div>
            </div>

            <div className={styles.postActions}>
              <button
                className={styles.actionButton}
                onClick={() => onLike?.(post.id)}
              >
                <Heart size={18} />
                {post.likedByCurrentUser ? 'Bỏ thích' : 'Thích'}
              </button>
              {onToggleHide && (
                <button
                  className={styles.actionButton}
                  onClick={() => onToggleHide(post.id)}
                >
                  {post.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                  {post.hidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles.actionButton} ${styles.danger}`}
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                      onDelete(post.id);
                    }
                  }}
                >
                  <Trash2 size={18} />
                  Xóa bài viết
                </button>
              )}
            </div>
          </div>
        )}

        {/* Edit/Create Mode */}
        {(mode === 'edit' || mode === 'create') && (
          <div className={styles.editPost}>
            <textarea
              className={styles.postTextarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài viết..."
              rows={6}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
              >
                {isSaving ? 'Đang lưu...' : (mode === 'create' ? 'Đăng bài' : 'Lưu thay đổi')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;