import { Button, Card, Typography, Space, Row, Col } from 'antd';
import { PhoneOutlined, MessageOutlined, MailOutlined, ShoppingCartOutlined, UserOutlined, CarOutlined, SafetyCertificateOutlined, GiftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './support.center.scss';

const { Title, Text } = Typography;

const SupportCenter = () => {
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
                            <img
                                src="https://salt.tikicdn.com/ts/ta/4e/cd/92/b3593adaf274fc49a6ace088ff96471b.png"
                                alt="chat"
                                className="support-center__contact-image"
                            />
                            <Text className="support-center__contact-label">Gặp Trợ lý cá nhân</Text>
                            <Button type="primary" className="support-center__contact-button">Chat ngay</Button>
                            <Text className="support-center__contact-description">8h-21h kể cả Thứ 7, CN</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="support-center__contact-item">
                            <MailOutlined className="support-center__contact-icon" />
                            <Text className="support-center__contact-label">Gửi yêu cầu hỗ trợ</Text>
                            <Button type="primary" className="support-center__contact-button">Tạo đơn yêu cầu</Button>
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
                            <Title level={5} className="support-center__info-title">Đơn hàng và vận chuyển</Title>
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
                            <SafetyCertificateOutlined className="support-center__info-icon" />
                            <Title level={5} className="support-center__info-title">Đổi trả, bảo hành và hồi hoàn</Title>
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
                            <Title level={5} className="support-center__info-title">Dịch vụ và chương trình</Title>
                            <Text className="support-center__info-description">
                                Chính sách của các dịch vụ và chương trình dành cho khách hàng
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
                                Quy chế hoạt động và chính sách của sàn thương mại điện tử BookStore
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