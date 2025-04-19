import { App, Button, Col, Divider, Form, InputNumber, Radio, Row, Space } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import type { FormProps } from 'antd';
import { createOrderAPI } from '@/services/api';

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod;
};

interface IProps {
    setCurrentStep: (v: number) => void;
}

const Payment = (props: IProps) => {
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);

    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const { message, notification } = App.useApp();
    const { setCurrentStep } = props;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD",
            });
        }
    }, [user]);

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            //sync React Context
            setCarts(newCarts);
        }
    };

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        const { address, fullName, method, phone } = values;
        const detail = carts.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText,
        }));

        setIsSubmit(true);
        const res = await createOrderAPI({
            name: fullName,
            address,
            phone,
            totalPrice,
            type: method,
            detail,
        });
        if (res?.data) {
            localStorage.removeItem('carts');
            setCarts([]);
            message.success('Mua hàng thành công!');
            props.setCurrentStep(2);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
        setIsSubmit(false);
    };


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={16} xs={24}>
                        {carts?.map((book, index) => (
                            <div key={index}>
                                {carts?.map((book, index) => {
                                    const currentBookPrice = book?.detail?.price ?? 0;
                                    return (
                                        <div className='order-book' key={`index-${index}`}>
                                            <div className='book-content'>
                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail.thumbnail}`} />
                                                <div className='title'>
                                                    {book?.detail?.mainText}
                                                </div>
                                                <div className='price'>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                                </div>
                                            </div>
                                            <div className='action'>
                                                <div className='quantity'>
                                                    <InputNumber
                                                        value={book?.quantity}
                                                    />
                                                </div>
                                                <div className='sum'>
                                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * book?.quantity)}
                                                </div>
                                                <DeleteTwoTone
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleRemoveBook(book._id)}
                                                    twoToneColor="#eb2f96"
                                                />
                                            </div>
                                        </div>
                                    )
                                })

                                }
                            </div>
                        ))}
                        <div>
                            <button style={{ cursor: "pointer" }} onClick={() => props.setCurrentStep(0)}>
                                Quay trở lại
                            </button>
                        </div>
                    </Col>
                    <Col md={8} xs={24}>
                        <Form
                            form={form}
                            name="payment-form"
                            onFinish={handlePlaceOrder}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <div className="order-sum">
                                <Form.Item<FieldType> label="Hình thức thanh toán" name="method">
                                    <Radio.Group>
                                        <Space direction="vertical">
                                            <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                                            <Radio value="BANKING">Chuyển khoản ngân hàng</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item<FieldType> label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType> label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType> label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                                    <TextArea rows={4} />
                                </Form.Item>

                                <div className='calculate'>
                                    <span>Tạm tính</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                    </span>
                                </div>
                                <Divider style={{ margin: "10px 0" }} />
                                <div className='calculate'>
                                    <span>Tổng tiền</span>
                                    <span className='sum-final'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                    </span>
                                </div>
                                <Divider style={{ margin: "10px 0" }} />
                                <Button
                                    color="danger"
                                    variant="solid"
                                    htmlType="submit"
                                    loading={isSubmit}
                                >
                                    Đặt Hàng ({carts?.length ?? 0})
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>

    )
}

export default Payment;