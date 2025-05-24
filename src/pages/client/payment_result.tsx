import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Result, Button, App } from 'antd';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useCurrentApp } from '@/components/context/app.context';

function PaymentResult() {
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'loading'>('loading');
    const location = useLocation();
    const navigate = useNavigate();
    const { setCarts } = useCurrentApp();
    // const { message, notification } = App.useApp();

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/check_payment?${searchParams.toString()}`
                );

                if (data.data.message === 'Thanh toán thành công') {
                    // Chỉ cần xóa dữ liệu tạm thời và cập nhật state
                    // Order đã được tạo ở bước trước khi redirect đến VNPay
                    localStorage.removeItem('carts');
                    localStorage.removeItem('checkout_carts');
                    localStorage.removeItem('checkout_info');
                    localStorage.removeItem('order_created_vnpay');

                    // Cập nhật state giỏ hàng
                    setCarts([]);

                    setPaymentStatus('success');
                } else {
                    setPaymentStatus('error');
                }
            } catch (error) {
                console.error('Payment check error:', error);
                setPaymentStatus('error');
            }
        };

        checkPaymentStatus();
    }, [location.search, setCarts]);

    return (
        <div
            style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f6f8fa',
            }}
        >
            <Card
                style={{
                    maxWidth: 500,
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: 'none',
                }}
            >
                {paymentStatus === 'loading' && (
                    <Result
                        status="info"
                        title="Đang xử lý thanh toán"
                        subTitle="Vui lòng đợi trong giây lát..."
                    />
                )}

                {paymentStatus === 'success' && (
                    <Result
                        icon={<SmileOutlined style={{ color: '#52c41a', fontSize: 64 }} />}
                        status="success"
                        title="Thanh toán thành công!"
                        subTitle="Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất."
                        extra={[
                            <Button type="primary" key="home" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                            <Button key="order" onClick={() => navigate('/history')}>
                                Xem lịch sử đơn hàng
                            </Button>,
                        ]}
                    />
                )}

                {paymentStatus === 'error' && (
                    <Result
                        icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 64 }} />}
                        status="error"
                        title="Thanh toán thất bại"
                        subTitle="Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau."
                        extra={[
                            <Button type="primary" key="retry" onClick={() => navigate('/checkout')}>
                                Thử lại
                            </Button>,
                            <Button key="home" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                        ]}
                    />
                )}
            </Card>
        </div>
    );
}

export default PaymentResult;