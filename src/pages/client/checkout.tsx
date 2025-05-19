import { Button, Card, Col, Form, Input, Radio, Row, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { notification } from "antd";

const columns = [
    {
        title: "Tên sản phẩm",
        dataIndex: "mainText",
        key: "mainText",
    },
    {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
    },
    {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
    },
];

function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState<string>("VNPAY");
    const nav = useNavigate();
    const { carts: contextCarts } = useCurrentApp();
    const [form] = Form.useForm();
    const [checkoutCarts, setCheckoutCarts] = useState<any[]>([]);

    useEffect(() => {
        // Lấy thông tin giỏ hàng từ localStorage
        const savedCarts = localStorage.getItem('checkout_carts');
        const savedInfo = localStorage.getItem('checkout_info');

        if (savedCarts) {
            setCheckoutCarts(JSON.parse(savedCarts));
        }

        if (savedInfo) {
            const info = JSON.parse(savedInfo);
            form.setFieldsValue(info);
        }
    }, []);

    const handlePayment = async () => {
        const total = checkoutCarts.reduce((init, item) => {
            return init + (item.detail.price * item.quantity);
        }, 0);

        try {
            if (paymentMethod === "VNPAY") {
                console.log('Calling payment API with amount:', total);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/create_payment?amount=${total}`
                );
                console.log('Payment API response:', response.data);

                if (response.data && response.data.data && response.data.data.paymentUrl) {
                    window.location.href = response.data.data.paymentUrl;
                } else {
                    throw new Error('Invalid payment URL response');
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            notification.error({
                message: "Lỗi thanh toán",
                description: "Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.",
                duration: 5,
            });
        }
    };

    const tableData = checkoutCarts.map((item, index) => ({
        key: index,
        mainText: item.detail.mainText,
        price: item.detail.price,
        quantity: item.quantity,
    }));

    return (
        <div style={{ padding: '20px' }}>
            <h1>Thanh toán</h1>
            <Row gutter={24}>
                <Col span={14}>
                    <Card title="Thông tin nhận hàng">
                        <Form
                            form={form}
                            layout="vertical"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <Form.Item label="Họ và tên" name="fullName">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Số điện thoại" name="phone">
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item label="Địa chỉ" name="address">
                                <TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={10}>
                    <Card title="Thông tin sản phẩm">
                        <Table pagination={false} dataSource={tableData} columns={columns} />
                        <h3 style={{ marginTop: '20px' }}>
                            Tổng tiền: {checkoutCarts.reduce((init, item) => init + (item.detail.price * item.quantity), 0).toLocaleString('vi-VN')} VNĐ
                        </h3>

                        <Radio.Group
                            defaultValue={"VNPAY"}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                            }}
                            style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: '20px' }}
                        >
                            <Radio value={"VNPAY"}>VNPAY</Radio>
                            <Radio value={"COD"}>Ship COD</Radio>
                        </Radio.Group>

                        <Button
                            onClick={handlePayment}
                            type="primary"
                            style={{ marginTop: 20, width: '100%' }}
                        >
                            Thanh toán
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Checkout; 