import { Row, Col, Rate, Divider, Button, message, App, List, Avatar, Input, Upload, Image, Form, Popover } from 'antd';
import 'styles/book.scss';
import ImageGallery from 'react-image-gallery';

import { MinusOutlined, PlusOutlined, SmileOutlined, PictureOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import type { ReactImageGalleryItem } from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { getCommentsByBookAPI, createCommentAPI, uploadFileAPI } from '@/services/api';
import EmojiPicker from 'emoji-picker-react';
import BookComments from './book.comment';

interface IProps {
    currentBook: IBookTable | null;
}

type UserAction = 'MINUS' | 'PLUS';

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

    const refGallery = useRef<ImageGallery>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComment, setLoadingComment] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [form] = Form.useForm();
    const [filter, setFilter] = useState<string>('latest');
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const filteredComments = (comments || []).filter(c => {
        if (filter === 'latest') return true;
        if (filter === 'hasImage' && c.image) return true;
        if (['5', '4', '3', '2', '1'].includes(filter)) return String(c.star) === filter;
        return false;
    });
    const [showFullDescription, setShowFullDescription] = useState(false);

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
        setComments(res.data || []);
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
            book_id: currentBook?._id,
            user_id: user.id,
            image: imageUrl,
        });
        form.resetFields();
        setImageUrl(undefined);
        fetchComments();
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
                                <Rate
                                    value={currentBook?.comments?.length
                                        ? Math.round(currentBook.comments.reduce((sum, c) => sum + (c.star || 0), 0) / currentBook.comments.length)
                                        : 0
                                    }
                                    disabled
                                    style={{ color: '#ffce3d', fontSize: 12 }}
                                />
                                <span className='sold'>
                                    <Divider type="vertical" />
                                    Đã bán {currentBook?.sold ?? 0}
                                </span>
                                {currentBook?.comments && currentBook.comments.length > 0 && (
                                    <span style={{ marginLeft: 8, color: '#666' }}>
                                        ({currentBook.comments.length} đánh giá)
                                    </span>
                                )}
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
                            {/* Thông tin chi tiết sách */}
                            <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Thông tin chi tiết</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    <div>
                                        <span style={{ color: '#666' }}>Tác giả:</span>
                                        <span style={{ marginLeft: 8 }}>{currentBook?.author}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#666' }}>Nhà xuất bản:</span>
                                        <span style={{ marginLeft: 8 }}>{'Chưa cập nhật'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#666' }}>Số trang:</span>
                                        <span style={{ marginLeft: 8 }}>{'Chưa cập nhật'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#666' }}>Ngày xuất bản:</span>
                                        <span style={{ marginLeft: 8 }}>{'Chưa cập nhật'}</span>
                                    </div>
                                </div>
                                {currentBook?.description && (
                                    <div style={{ marginTop: 24 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Mô tả sản phẩm</h3>
                                        <div
                                            style={{
                                                color: '#444',
                                                fontSize: 15,
                                                lineHeight: 1.6,
                                                whiteSpace: 'pre-line',
                                                background: '#fafbfc',
                                                borderRadius: 12,
                                                padding: 20,
                                                boxShadow: '0 1px 4px #f0f1f2',
                                                maxWidth: 600,
                                                margin: '0 auto',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: showFullDescription ? 'unset' : 4,
                                                height: showFullDescription ? 'auto' : '6.4em', // 4 lines * 1.6em
                                                transition: 'height 0.3s',
                                            }}
                                        >
                                            {currentBook.description}
                                        </div>
                                        {/* Nút xem thêm/ẩn bớt */}
                                        {currentBook.description.split('\n').length > 4 || currentBook.description.length > 200 ? (
                                            <div style={{ textAlign: 'center', marginTop: 8 }}>
                                                <span
                                                    style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }}
                                                    onClick={() => setShowFullDescription(v => !v)}
                                                >
                                                    {showFullDescription ? 'Ẩn bớt' : 'Xem thêm'}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <BookComments bookId={currentBook?._id || ''} user={user} />
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
