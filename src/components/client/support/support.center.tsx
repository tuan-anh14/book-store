import { Button, Card, Typography, Space, Row, Col } from 'antd';
import { PhoneOutlined, MessageOutlined, MailOutlined, ShoppingCartOutlined, UserOutlined, CarOutlined, SafetyCertificateOutlined, GiftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './support.center.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ChatBot from '../../chatbot/chatbot';

const { Title, Text } = Typography;

const SupportCenter = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleChatClick = () => {
        setIsChatOpen(true);
    };

    return (
        <div className="support-center">
            <div className="support-center__header">
                <Title level={2}>Trung tâm hỗ trợ</Title>
            </div>
            <div className="support-center__container">
                <Title level={3}>Chăm sóc khách hàng</Title>
                <Row gutter={[24, 24]} className="support-center__contact">
                    <Col xs={24} sm={8}>
                        <Card className="support-center__contact-item">
                            <PhoneOutlined className="support-center__contact-icon" />
                            <Text className="support-center__contact-label">Hotline</Text>
                            <Text className="support-center__contact-action">1900-6035</Text>
                            <Text className="support-center__contact-description">1000 đ/phút, 8h-21h kể cả thứ 7, CN</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__contact-item">
                            <MessageOutlined className="support-center__contact-icon" />
                            <Text className="support-center__contact-label">Chat với BookStore</Text>
                            <Button type="primary" className="support-center__contact-button" onClick={handleChatClick}>Chat ngay</Button>
                            <Text className="support-center__contact-description">8h-21h kể cả Thứ 7, CN</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__contact-item">
                            <MailOutlined className="support-center__contact-icon" />
                            <Text className="support-center__contact-label">Gửi yêu cầu hỗ trợ</Text>
                            <Button type="primary" className="support-center__contact-button" onClick={() => navigate('/support/request')}>Tạo đơn yêu cầu</Button>
                            <Text className="support-center__contact-description">Hoặc email đến hotro@bookstore.vn</Text>
                        </Card>
                    </Col>
                </Row>

                <Title level={3} style={{ marginTop: 40 }}>Tra cứu thông tin</Title>
                <Row gutter={[24, 24]} className="support-center__info">
                    <Col xs={24} sm={8}>
                        <Card className="support-center__info-item">
                            <ShoppingCartOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Đơn hàng và thanh toán</Title>
                            <Text className="support-center__info-description">
                                Cách tra cứu đơn hàng, sử dụng mã giảm giá và các phương thức thanh toán...
                            </Text>
                            <Button type="link" className="support-center__info-cta">
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__info-item">
                            <UserOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Tài khoản của tôi</Title>
                            <Text className="support-center__info-description">
                                Cách đăng ký tài khoản, chỉnh sửa thông tin cá nhân, theo dõi đơn hàng...
                            </Text>
                            <Button type="link" className="support-center__info-cta">
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__info-item">
                            <CarOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Vận chuyển và giao hàng</Title>
                            <Text className="support-center__info-description">
                                Chính sách vận chuyển, thời gian giao hàng, phí vận chuyển...
                            </Text>
                            <Button type="link" className="support-center__info-cta">
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__info-item">
                            <SafetyCertificateOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Đổi trả và bảo hành</Title>
                            <Text className="support-center__info-description">
                                Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi trả online ...
                            </Text>
                            <Button type="link" className="support-center__info-cta">
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__info-item">
                            <GiftOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Chương trình khuyến mãi</Title>
                            <Text className="support-center__info-description">
                                Thông tin về các chương trình khuyến mãi và ưu đãi dành cho khách hàng
                            </Text>
                            <Button type="link" className="support-center__info-cta">
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__info-item">
                            <InfoCircleOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Thông tin về BookStore</Title>
                            <Text className="support-center__info-description">
                                Quy chế hoạt động và chính sách của BookStore
                            </Text>
                            <Button type="link" className="support-center__info-cta">
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SupportCenter; 