import { Row, Col, Rate, Divider, Button, message, App, List, Avatar, Input, Upload, Image, Form } from 'antd';
import 'styles/book.scss';
import ImageGallery from 'react-image-gallery';

import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import type { ReactImageGalleryItem } from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { getCommentsByBookAPI, createCommentAPI } from '@/services/api';

interface IProps {
    currentBook: IBookTable | null;
}

type UserAction = 'MINUS' | 'PLUS';

const FEELINGS = ['😍', '😁', '😐', '😢', '😡'];

const BookDetail = (props: IProps) => {
    const { currentBook } = props;
    const [imageGallery, setImageGallery] = useState<
        {
            original: string;
            thumbnail: string;
            originalClass: string;
            thumbnailClass: string;
        }[]
    >([]);

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const { carts, setCarts, user } = useCurrentApp();
    const { message } = App.useApp();

    const refGallery = useRef<ImageGallery>(null); // hoặc cụ thể hơn: useRef<ImageGallery | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComment, setLoadingComment] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [form] = Form.useForm();
    const [filter, setFilter] = useState<string>('latest');
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const filteredComments = comments.filter(c => {
        if (filter === 'latest') return true;
        if (filter === 'hasImage' && c.image) return true;
        if (['5', '4', '3', '2', '1'].includes(filter)) return String(c.star) === filter;
        return false;
    });

    useEffect(() => {
        if (currentBook) {
            //build images
            const images: {
                original: string;
                thumbnail: string;
                originalClass: string;
                thumbnailClass: string;
            }[] = [];
            if (currentBook.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                });
            }
            if (currentBook.slider) {
                currentBook.slider.forEach((slide: string) => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${slide}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${slide}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    });
                });
            }
            setImageGallery(images);
        }
    }, [currentBook]);

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    };

    const onChange = (value: number) => {
        console.log('changed', value);
    };

    const handleChangeButton = (type: UserAction) => {
        if (type == "MINUS") {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type == "PLUS" && currentBook) {
            if (currentQuantity === +currentBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    };

    const handleAddToCart = () => {
        //update localStorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];

            //check exist
            let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity =
                    carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                });
            }

            localStorage.setItem("carts", JSON.stringify(carts));
            setCarts(carts);
        } else {
            //create
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }];
            localStorage.setItem("carts", JSON.stringify(data));

            //sync React Context
            setCarts(data);
        }
        message.success("Thêm vào giỏ hàng thành công!");

    }

    const fetchComments = async () => {
        if (!currentBook?._id) return;
        setLoadingComment(true);
        const res = await getCommentsByBookAPI(currentBook._id);
        setComments(res.data);
        setLoadingComment(false);
    };

    useEffect(() => {
        fetchComments();
    }, [currentBook?._id]);

    const handleCommentFinish = async (values: any) => {
        if (!user) {
            message.error('Bạn cần đăng nhập để bình luận!');
            return;
        }
        await createCommentAPI({
            ...values,
            // book_id: currentBook._id,
            user_id: user.id,
            image: imageUrl,
        });
        form.resetFields();
        setImageUrl(undefined);
        fetchComments();
    };

    const handleUpload = (info: any) => {
        if (info.file.status === 'done' && info.file.response?.data?.fileName) {
            setImageUrl(`${import.meta.env.VITE_BACKEND_URL}/images/comment/${info.file.response.data.fileName}`);
        }
    };

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1100, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ background: '#fff', borderRadius: 8, padding: 32, boxShadow: '0 2px 8px #f0f1f2' }}>
                    {/* Chi tiết sách */}
                    <Row gutter={[32, 32]}>
                        <Col md={10} sm={24} xs={24}>
                            <ImageGallery
                                ref={refGallery}
                                items={imageGallery}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24} xs={24}>
                            <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                            <div className='title'>{currentBook?.mainText}</div>
                            <div className='rating'>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                <span className='sold'>
                                    <Divider type="vertical" />
                                    Đã bán {currentBook?.sold ?? 0}
                                </span>
                            </div>
                            <div className='price'>
                                <span className='currency'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
                                </span>
                            </div>
                            <div className='delivery'>
                                <div>
                                    <span className='left'>Vận chuyển</span>
                                    <span className='right'>Miễn phí vận chuyển</span>
                                </div>
                            </div>
                            <div className='quantity'>
                                <span className='left'>Số lượng</span>
                                <span className='right'>
                                    <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                    <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                    <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                </span>
                            </div>
                            <div className='buy'>
                                <button className='cart' onClick={() => handleAddToCart()}>
                                    <BsCartPlus className='icon-cart' />
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button className='now'>Mua ngay</button>
                            </div>
                            {/* Mô tả sách */}
                            {currentBook?.description && (
                                <div style={{ marginTop: 24, color: '#444', fontSize: 15 }}>
                                    <b>Mô tả:</b>
                                    <div style={{ marginTop: 4 }}>{currentBook.description}</div>
                                </div>
                            )}
                        </Col>
                    </Row>
                    {/* Divider ngăn cách */}
                    <Divider orientation="left" style={{ margin: '40px 0 24px 0', fontWeight: 600, fontSize: 18 }}>Khách hàng đánh giá</Divider>
                    {/* Đánh giá & bình luận */}
                    {/* Tổng quan đánh giá, bộ lọc, ảnh, danh sách bình luận, phân trang, form đánh giá */}
                    {/* Tổng quan đánh giá */}
                    <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', width: '100%', paddingBottom: 16 }}>
                            {/* Tổng quan */}
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Tổng quan</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ fontSize: 40, fontWeight: 700, color: '#ffb400' }}> {
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
                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Tất cả hình ảnh ({comments.filter(c => c.image).length})</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {comments.filter(c => c.image).map((c, idx) => (
                                            <Image key={idx} src={c.image} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
                                        ))}
                                        {comments.filter(c => c.image).length === 0 && <span style={{ color: '#888' }}>Chưa có hình ảnh</span>}
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
                                <Avatar src={item.user_id?.avatar} size={48} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <b>{item.user_id?.fullName}</b>
                                        <Rate disabled value={item.star} style={{ fontSize: 14 }} />
                                        <span style={{ color: '#888', fontSize: 12 }}>{new Date(item.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div style={{ margin: '8px 0' }}>{item.content}</div>
                                    {item.feeling && <div style={{ fontSize: 18 }}>{item.feeling}</div>}
                                    {item.image && <Image width={80} src={item.image} style={{ marginTop: 4 }} />}
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
                    <Form
                        form={form}
                        onFinish={handleCommentFinish}
                        layout="vertical"
                        style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}
                        disabled={!user}
                    >
                        <Form.Item name="star" label="Đánh giá" rules={[{ required: true }]}> <Rate /> </Form.Item>
                        <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}> <Input.TextArea rows={3} /> </Form.Item>
                        <Form.Item name="feeling" label="Cảm xúc">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {FEELINGS.map(f => (
                                    <span
                                        key={f}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: 24,
                                            border: form.getFieldValue('feeling') === f ? '2px solid #1890ff' : '1px solid #eee',
                                            borderRadius: 6,
                                            padding: 2,
                                            background: form.getFieldValue('feeling') === f ? '#e6f7ff' : undefined,
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40
                                        }}
                                        onClick={() => form.setFieldsValue({ feeling: f })}
                                    >
                                        {f}
                                    </span>
                                ))}
                                <Input
                                    style={{ width: 60, marginLeft: 8, textAlign: 'center' }}
                                    value={form.getFieldValue('feeling') || ''}
                                    readOnly
                                    placeholder="Chọn"
                                />
                            </div>
                        </Form.Item>
                        <Form.Item label="Ảnh (nếu có)">
                            <Upload
                                name="file"
                                action={`${import.meta.env.VITE_BACKEND_URL}/api/v1/files/upload`}
                                onChange={handleUpload}
                                showUploadList={false}
                            >
                                <Button>Upload</Button>
                            </Upload>
                            {imageUrl && <Image width={80} src={imageUrl} />}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Gửi đánh giá</Button>
                        </Form.Item>
                    </Form>
                    {!user && (
                        <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
                            Bạn cần đăng nhập để đánh giá
                        </div>
                    )}
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ''}
            />
        </div>
    );
};

export default BookDetail;
