import { Row, Col, Rate, Divider, Button } from 'antd';
import 'styles/book.scss';
import ImageGallery from 'react-image-gallery';

import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import type { ReactImageGalleryItem } from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import ModalGallery from './modal.gallery';

interface IProps {
    currentBook: IBookTable | null;
}

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

    const refGallery = useRef<ImageGallery>(null); // hoặc cụ thể hơn: useRef<ImageGallery | null>(null);

    // const images: ReactImageGalleryItem[] = [
    //     {
    //         original: 'https://picsum.photos/id/1018/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1018/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1018/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    // ];

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

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
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
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
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
                                        <button><MinusOutlined /></button>
                                        <input defaultValue={1} />
                                        <button><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart'>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='now'>Mua ngay</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
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
