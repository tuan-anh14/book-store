import { useEffect, useState } from 'react';
import { Rate, Divider, Button, message, Avatar, Input, Upload, Image, Form, Popover } from 'antd';
import { SmileOutlined, PictureOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import { getCommentsByBookAPI, createCommentAPI, uploadFileAPI } from '@/services/api';
import type { UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { App } from 'antd';
import './book.comment.scss';

interface BookCommentsProps {
    bookId: string;
    user: any;
}

const BookComments = ({ bookId, user }: BookCommentsProps) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComment, setLoadingComment] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [form] = Form.useForm();
    const [filter, setFilter] = useState<string>('latest');
    const [page, setPage] = useState<number>(1);
    const pageSize = 5;
    const [content, setContent] = useState('');
    const [showSharePopup, setShowSharePopup] = useState(false);
    const { notification } = App.useApp();
    const [helpfulComments, setHelpfulComments] = useState<{ [key: string]: boolean }>({});

    const filteredComments = (comments || []).filter(c => {
        if (filter === 'latest') return true;
        if (filter === 'hasImage' && c.image) return true;
        if (['5', '4', '3', '2', '1'].includes(filter)) return String(c.star) === filter;
        return false;
    });

    const fetchComments = async () => {
        if (!bookId) return;
        setLoadingComment(true);
        const res = await getCommentsByBookAPI(bookId);
        setComments(res.data || []);
        setLoadingComment(false);
    };

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line
    }, [bookId]);

    const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
        const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPngOrWebp) {
            message.error('Bạn chỉ có thể upload file JPG/PNG/WebP!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPngOrWebp && isLt2M || Upload.LIST_IGNORE;
    };

    const handleUploadFile = async (file: File) => {
        setLoadingUpload(true);
        try {
            const res = await uploadFileAPI(file, 'comment');
            if (res?.data?.fileName) {
                const url = `${import.meta.env.VITE_BACKEND_URL}/images/comment/${res.data.fileName}`;
                setImageUrls(prev => [...prev, url]);
            }
        } catch (error) {
            message.error('Upload ảnh thất bại!');
        }
        setLoadingUpload(false);
    };

    const handleCommentFinish = async (values: any) => {
        if (!user) {
            message.error('Bạn cần đăng nhập để bình luận!');
            return;
        }

        const star = Number(values.star);
        if (!star || star < 1 || star > 5) {
            message.error('Vui lòng chọn đánh giá!');
            return;
        }

        setLoadingComment(true);

        const user_id = user._id || user.id;
        const payload = {
            content: content.trim(),
            star,
            book_id: bookId,
            user_id,
            images: imageUrls,
        };

        createCommentAPI(payload).then((result) => {
            const data = result?.data || result;
            // @ts-ignore: Unreachable code error
            if (result.statusCode === 201) {
                notification.success({
                    message: "Thành công",
                    description: "Bình luận đã được gửi thành công!",
                });
                form.resetFields();
                setContent('');
                setImageUrls([]);
                fetchComments();
                // @ts-ignore: Unreachable code error
            } else if (result.statusCode === 400) {
                notification.error({
                    message: "Không thể gửi bình luận",
                    description: result.data.message || "Bạn cần phải mua sách rồi mới được đánh giá!",
                });
            } else {
                notification.error({
                    message: "Không thể gửi bình luận",
                    description: result.data.message || "Bạn cần phải mua sách rồi mới được đánh giá!",
                });
            }
        }).catch((error) => {
            notification.error({
                message: "Không thể gửi bình luận",
                description: error?.response?.data?.message || "Bạn cần phải mua sách rồi mới được đánh giá!",
            });
        }).finally(() => {
            setLoadingComment(false);
        });
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            message.success('Đã sao chép link!');
        });
    };

    const handleShare = (type: string) => {
        const url = window.location.href;
        let shareUrl = '';

        switch (type) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'messenger':
                shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
                break;
            case 'zalo':
                shareUrl = `https://zalo.me/share?u=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    const handleHelpfulClick = (commentId: string) => {
        setHelpfulComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    return (
        <>
            <Divider orientation="left" style={{ margin: '40px 0 24px 0', fontWeight: 600, fontSize: 18 }}>Khách hàng đánh giá</Divider>
            {/* Tổng quan đánh giá, bộ lọc, ảnh */}
            <div className="book-comment__overview">
                <div className="book-comment__overview-container">
                    {/* Tổng quan */}
                    <div>
                        <div className="book-comment__overview-title">Tổng quan</div>
                        <div className="book-comment__overview-rating">
                            <div className="book-comment__overview-rating-number">{
                                comments.length ? (comments.reduce((sum, c) => sum + (c.star || 0), 0) / comments.length).toFixed(1) : '0.0'
                            }</div>
                            <Rate
                                disabled
                                value={comments.length ? (comments.reduce((sum, c) => sum + (c.star || 0), 0) / comments.length) : 0}
                                style={{ fontSize: 24, color: '#ffce3d' }}
                            />
                        </div>
                        <div className="book-comment__overview-rating-count">({comments.length} đánh giá)</div>
                        {/* Phân bố sao */}
                        <div className="book-comment__overview-distribution">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = comments.filter(c => c.star === star).length;
                                const percent = comments.length ? Math.round((count / comments.length) * 100) : 0;
                                return (
                                    <div key={star} className="book-comment__overview-distribution-item">
                                        <Rate disabled value={star} count={5} style={{ fontSize: 14, color: '#ffce3d' }} />
                                        <div className="book-comment__overview-distribution-item-bar">
                                            <div className="book-comment__overview-distribution-item-bar-fill" style={{ width: `${percent}%` }} />
                                        </div>
                                        <span style={{ minWidth: 24 }}>{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* Bộ lọc và ảnh */}
                    <div>
                        {/* Bộ lọc */}
                        <div className="book-comment__filter">
                            {[
                                { label: 'Mới nhất', value: 'latest' },
                                { label: 'Có hình ảnh', value: 'hasImage' },
                                { label: '5 sao', value: '5' },
                                { label: '4 sao', value: '4' },
                                { label: '3 sao', value: '3' },
                                { label: '2 sao', value: '2' },
                                { label: '1 sao', value: '1' },
                            ].map(f => (
                                <Button
                                    key={f.value}
                                    type={filter === f.value ? 'primary' : 'default'}
                                    size="small"
                                    onClick={() => setFilter(f.value)}
                                >
                                    {f.label}
                                </Button>
                            ))}
                        </div>
                        {/* Ảnh đánh giá */}
                        <div className="book-comment__images">
                            <div className="book-comment__images-title">Tất cả hình ảnh ({comments.reduce((sum, c) => sum + (c.images?.length || 0), 0)})</div>
                            <div className="book-comment__images-container">
                                {comments.flatMap(c => c.images || []).map((image, idx) => (
                                    <Image key={idx} src={image} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
                                ))}
                                {comments.reduce((sum, c) => sum + (c.images?.length || 0), 0) === 0 && <span style={{ color: '#888' }}>Chưa có hình ảnh</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Danh sách bình luận + phân trang */}
            <div className="book-comment__list">
                {filteredComments.length === 0 && (
                    <div className="book-comment__list-empty">Chưa có bình luận</div>
                )}
                {filteredComments.slice((page - 1) * pageSize, page * pageSize).map(item => (
                    <div key={item._id} className="book-comment__list-item">
                        <Avatar
                            src={
                                item.user_id?.avatar
                                    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${item.user_id.avatar}`
                                    : undefined
                            }
                            size={48}
                        />
                        <div style={{ flex: 1 }}>
                            <div className="book-comment__list-item-header">
                                <b>{item.user_id?.fullName}</b>
                                <Rate disabled value={item.star} style={{ fontSize: 14 }} />
                                <span className="book-comment__list-item-time">{new Date(item.createdAt).toLocaleString()}</span>
                                <div className="book-comment__verified-badge">
                                    <span className="book-comment__verified-badge-icon">
                                        <span className="book-comment__verified-badge-icon-check">✓</span>
                                    </span>
                                    Đã mua hàng
                                </div>
                            </div>
                            <div className="book-comment__list-item-content">{item.content}</div>
                            {item.images && item.images.length > 0 && (
                                <div className="book-comment__list-item-images">
                                    {item.images.map((image: string, idx: number) => (
                                        <Image key={idx} width={80} src={image} style={{ border: '1px solid #eee', borderRadius: 4 }} />
                                    ))}
                                </div>
                            )}
                            <div className="book-comment__list-item-actions">
                                <Button
                                    size="small"
                                    icon={<img src="https://salt.tikicdn.com/ts/upload/10/9f/8b/54e5f6b084fb9e3445036b4646bc48b5.png" width={20} />}
                                    onClick={() => handleHelpfulClick(item._id)}
                                    type={helpfulComments[item._id] ? 'primary' : 'default'}
                                >
                                    Hữu ích
                                </Button>
                                <Button
                                    size="small"
                                    icon={<img src="https://salt.tikicdn.com/ts/upload/3f/fa/d4/7057dfb58b682b1b0a2b9683228863ee.png" width={20} />}
                                    onClick={() => setShowSharePopup(true)}
                                >
                                    Chia sẻ
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Phân trang */}
                {filteredComments.length > pageSize && (
                    <div className="book-comment__pagination">
                        <Button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ marginRight: 8 }}>Trước</Button>
                        {Array.from({ length: Math.ceil(filteredComments.length / pageSize) }, (_, i) => (
                            <Button
                                key={i + 1}
                                type={page === i + 1 ? 'primary' : 'default'}
                                size="small"
                                onClick={() => setPage(i + 1)}
                                style={{ margin: '0 2px' }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            disabled={page === Math.ceil(filteredComments.length / pageSize)}
                            onClick={() => setPage(page + 1)}
                            style={{ marginLeft: 8 }}
                        >
                            Sau
                        </Button>
                    </div>
                )}
            </div>
            {/* Form gửi bình luận */}
            <Divider orientation="left" style={{ margin: '40px 0 24px 0', fontWeight: 600, fontSize: 18 }}>Viết bình luận</Divider>
            {user ? (
                <Form
                    form={form}
                    onFinish={handleCommentFinish}
                    layout="vertical"
                    className="book-comment__form"
                >
                    <Form.Item
                        name="star"
                        label="Đánh giá"
                        rules={[
                            { required: true, type: 'number', min: 1, message: 'Vui lòng chọn đánh giá!' }
                        ]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <div className="book-comment__form-textarea">
                            <Input.TextArea
                                rows={3}
                                value={content}
                                onChange={e => {
                                    setContent(e.target.value.replace(/^C:\\fakepath\\[^\s]+$/, ''));
                                    form.setFieldsValue({ content: e.target.value.replace(/^C:\\fakepath\\[^\s]+$/, '') });
                                }}
                                style={{ paddingRight: 80 }}
                            />
                            <Popover
                                content={<EmojiPicker onEmojiClick={(emojiObj) => {
                                    const current = content || '';
                                    setContent(current + emojiObj.emoji);
                                    form.setFieldsValue({ content: current + emojiObj.emoji });
                                }} />}
                                trigger="click"
                            >
                                <SmileOutlined className="book-comment__form-textarea-emoji" />
                            </Popover>
                            <Upload
                                name="file"
                                customRequest={({ file }) => handleUploadFile(file as File)}
                                showUploadList={false}
                                accept="image/*"
                                beforeUpload={beforeUpload}
                            >
                                <PictureOutlined className="book-comment__form-textarea-upload" />
                            </Upload>
                        </div>
                    </Form.Item>
                    {imageUrls.length > 0 && (
                        <div className="book-comment__form-images">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="book-comment__form-images-item">
                                    <Image width={80} src={url} style={{ border: '1px solid #eee', borderRadius: 4 }} />
                                    <Button
                                        size="small"
                                        danger
                                        className="book-comment__form-images-item-remove"
                                        onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))}
                                    >
                                        x
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loadingComment}>Gửi bình luận</Button>
                    </Form.Item>
                </Form>
            ) : (
                <div className="book-comment__login-required">
                    Bạn cần đăng nhập để đánh giá
                </div>
            )}

            {/* Share Popup */}
            {showSharePopup && (
                <div className="book-comment__share-popup" onClick={() => setShowSharePopup(false)}>
                    <div className="book-comment__share-popup-content" onClick={e => e.stopPropagation()}>
                        <div className="book-comment__share-popup-content-header">
                            <div className="book-comment__share-popup-content-header-title">
                                Chia sẻ với bạn bè!
                            </div>
                            <img
                                src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/close-black.svg"
                                className="book-comment__share-popup-content-header-close"
                                onClick={() => setShowSharePopup(false)}
                                alt="close"
                            />
                        </div>
                        <div className="book-comment__share-popup-content-copy">
                            <span className="book-comment__share-popup-content-copy-url">
                                {window.location.href}
                            </span>
                            <button
                                className="book-comment__share-popup-content-copy-button"
                                onClick={handleCopyLink}
                            >
                                <img
                                    src="https://salt.tikicdn.com/cache/w500/ts/brickv2og/82/9a/44/c6f38efd1336d95be366e5dfbb600f23.png"
                                    alt="copy"
                                />
                                <span>Sao chép</span>
                            </button>
                        </div>
                        <ul className="book-comment__share-popup-content-social">
                            <li className="book-comment__share-popup-content-social-item" onClick={() => handleShare('facebook')}>
                                <img src="https://salt.tikicdn.com/cache/w100/ts/upload/7b/06/71/32738d3827021cc973aac49d53945160.png" alt="facebook" />
                                <span>FaceBook</span>
                            </li>
                            <li className="book-comment__share-popup-content-social-item" onClick={() => handleShare('messenger')}>
                                <img src="https://salt.tikicdn.com/cache/w100/ts/upload/e6/fb/b4/31e2d7b0fed5775c999dfb5e5bc0ab38.png" alt="messenger" />
                                <span>Messenger</span>
                            </li>
                            <li className="book-comment__share-popup-content-social-item" onClick={() => handleShare('telegram')}>
                                <img src="https://salt.tikicdn.com/cache/w100/ts/upload/36/98/59/a3e7abb1fa23676ab93cc15cae5e1b8a.png" alt="telegram" />
                                <span>Telegram</span>
                            </li>
                            <li className="book-comment__share-popup-content-social-item" onClick={() => handleShare('zalo')}>
                                <img src="https://salt.tikicdn.com/cache/w100/ts/upload/cc/fd/31/da8a5e0142380cda13b363dfb70eafef.png" alt="zalo" />
                                <span>Zalo</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookComments; 