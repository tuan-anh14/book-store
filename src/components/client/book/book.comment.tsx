import { useEffect, useState } from 'react';
import { Rate, Divider, Button, message, Avatar, Input, Upload, Image, Form, Popover } from 'antd';
import { SmileOutlined, PictureOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import { getCommentsByBookAPI, createCommentAPI, uploadFileAPI } from '@/services/api';
import type { UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';

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
        const user_id = user._id || user.id;
        const payload = {
            content: content,
            star,
            book_id: bookId,
            user_id,
            images: imageUrls,
        };
        await createCommentAPI(payload);
        form.resetFields();
        setContent('');
        setImageUrls([]);
        fetchComments();
    };

    return (
        <>
            <Divider orientation="left" style={{ margin: '40px 0 24px 0', fontWeight: 600, fontSize: 18 }}>Khách hàng đánh giá</Divider>
            {/* Tổng quan đánh giá, bộ lọc, ảnh */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', width: '100%', paddingBottom: 16 }}>
                    {/* Tổng quan */}
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Tổng quan</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ fontSize: 40, fontWeight: 700, color: '#ffb400' }}>{
                                comments.length ? (comments.reduce((sum, c) => sum + (c.star || 0), 0) / comments.length).toFixed(1) : '0.0'
                            }</div>
                            <Rate
                                disabled
                                value={comments.length ? (comments.reduce((sum, c) => sum + (c.star || 0), 0) / comments.length) : 0}
                                style={{ fontSize: 24, color: '#ffce3d' }}
                            />
                        </div>
                        <div style={{ color: '#888', marginTop: 8 }}>({comments.length} đánh giá)</div>
                        {/* Phân bố sao */}
                        <div style={{ marginTop: 16 }}>
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = comments.filter(c => c.star === star).length;
                                const percent = comments.length ? Math.round((count / comments.length) * 100) : 0;
                                return (
                                    <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                        <Rate disabled value={star} count={5} style={{ fontSize: 14, color: '#ffce3d' }} />
                                        <div style={{ width: 120, height: 8, background: '#eee', borderRadius: 4, margin: '0 8px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percent}%`, height: 8, background: '#ffb400' }} />
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
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
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
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Tất cả hình ảnh ({comments.reduce((sum, c) => sum + (c.images?.length || 0), 0)})</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
            <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                {filteredComments.length === 0 && (
                    <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', margin: '16px 0' }}>Chưa có bình luận</div>
                )}
                {filteredComments.slice((page - 1) * pageSize, page * pageSize).map(item => (
                    <div key={item._id} style={{ display: 'flex', gap: 16, borderBottom: '1px solid #f2f2f2', padding: '16px 0' }}>
                        <Avatar
                            src={
                                item.user_id?.avatar
                                    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${item.user_id.avatar}`
                                    : undefined
                            }
                            size={48}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <b>{item.user_id?.fullName}</b>
                                <Rate disabled value={item.star} style={{ fontSize: 14 }} />
                                <span style={{ color: '#888', fontSize: 12 }}>{new Date(item.createdAt).toLocaleString()}</span>
                            </div>
                            <div style={{ margin: '8px 0' }}>{item.content}</div>
                            {item.images && item.images.length > 0 && (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                    {item.images.map((image: string, idx: number) => (
                                        <Image key={idx} width={80} src={image} style={{ border: '1px solid #eee', borderRadius: 4 }} />
                                    ))}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                                <Button size="small" icon={<img src="https://salt.tikicdn.com/ts/upload/10/9f/8b/54e5f6b084fb9e3445036b4646bc48b5.png" width={20} />}>
                                    Hữu ích
                                </Button>
                                <Button size="small" icon={<img src="https://salt.tikicdn.com/ts/upload/82/f0/7f/7353641630f811453e875bb5450065d8.png" width={20} />}>
                                    Bình luận
                                </Button>
                                <Button size="small" icon={<img src="https://salt.tikicdn.com/ts/upload/3f/fa/d4/7057dfb58b682b1b0a2b9683228863ee.png" width={20} />}>
                                    Chia sẻ
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Phân trang */}
                {filteredComments.length > pageSize && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
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
                        <Button disabled={page === Math.ceil(filteredComments.length / pageSize)} onClick={() => setPage(page + 1)} style={{ marginLeft: 8 }}>Sau</Button>
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
                    style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}
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
                        <div style={{ position: 'relative' }}>
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
                                <SmileOutlined
                                    style={{
                                        position: 'absolute',
                                        right: 40,
                                        bottom: 8,
                                        fontSize: 22,
                                        color: '#ffb400',
                                        cursor: 'pointer',
                                        opacity: 0.8
                                    }}
                                />
                            </Popover>
                            <Upload
                                name="file"
                                customRequest={({ file }) => handleUploadFile(file as File)}
                                showUploadList={false}
                                accept="image/*"
                                beforeUpload={beforeUpload}
                            >
                                <PictureOutlined
                                    style={{
                                        position: 'absolute',
                                        right: 8,
                                        bottom: 8,
                                        fontSize: 22,
                                        color: '#1890ff',
                                        cursor: 'pointer',
                                        opacity: 0.8
                                    }}
                                />
                            </Upload>
                        </div>
                    </Form.Item>
                    {imageUrls.length > 0 && (
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {imageUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <Image width={80} src={url} style={{ border: '1px solid #eee', borderRadius: 4 }} />
                                    <Button
                                        size="small"
                                        danger
                                        style={{ position: 'absolute', top: 0, right: 0, padding: 0, width: 20, height: 20, borderRadius: '50%' }}
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
                <div style={{ color: 'red', marginBottom: 16, textAlign: 'center', background: '#fff', padding: 16, borderRadius: 8 }}>
                    Bạn cần đăng nhập để đánh giá
                </div>
            )}
        </>
    );
};

export default BookComments; 