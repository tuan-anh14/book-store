import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from 'react-image-gallery';
import 'styles/book.scss';

interface ImageItem {
    original: string;
    thumbnail?: string;
    originalClass?: string;
    thumbnailClass?: string;
}

interface ModalGalleryProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    currentIndex: number;
    items: ImageItem[];
    title: string;
}

const ModalGallery: React.FC<ModalGalleryProps> = (props) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const refGallery = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex]);

    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null} //hide footer
            closable={false} //hide close button
            className="modal-gallery"
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        startIndex={currentIndex}
                        showThumbnails={false}
                        onSlide={(i: number) => setActiveIndex(i)}
                        slideDuration={0}
                    />
                </Col>
                <Col span={8}>
                    <div style={{ padding: '5px 0 20px 0' }}>{title}</div>
                    <div>
                        <Row gutter={[20, 20]}>
                            {
                                items?.map((item, i) => {
                                    return (
                                        <Col key={`image-${i}`}>
                                            <Image
                                                wrapperClassName={"img-normal"}
                                                width={100}
                                                height={100}
                                                src={item.original}
                                                preview={false}
                                                onClick={() => {
                                                    refGallery.current?.slideToIndex(i);
                                                }}
                                            />
                                            <div className={activeIndex === i ? "active" : ""}></div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

export default ModalGallery;
