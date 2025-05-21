import { App, Button, Divider, Form, Input, Space, theme } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { registerAPI } from '@/services/api';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
} from '@ant-design/icons';

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { token } = theme.useToken();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { email, fullName, password, phone } = values;
        setTimeout(async () => {
            const res = await registerAPI(
                fullName,
                email,
                password,
                phone
            );

            if (res.data) {
                message.success("Đăng ký user thành công.");
                navigate("/login");
            } else {
                message.error(res.message)
            }
            setIsSubmit(false)
        }, 2000);
    };

    return (
        <div className='register-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng ký tài khoản</h2>
                            <p className='text text-normal'>Tạo tài khoản để mua sắm tại BookStore</p>
                        </div>
                        <Form
                            name='form-register'
                            onFinish={onFinish}
                            autoComplete='off'
                            size='large'
                        >
                            <Form.Item<FieldType>
                                name="fullName"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="prefixIcon" />}
                                    placeholder="Họ và tên của bạn"
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="prefixIcon" />}
                                    placeholder="Email của bạn"
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="prefixIcon" />}
                                    placeholder="Mật khẩu của bạn"
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="phone"
                                rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            >
                                <Input
                                    prefix={<PhoneOutlined className="prefixIcon" />}
                                    placeholder="Số điện thoại của bạn"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type='primary' htmlType='submit' loading={isSubmit} block>
                                    Đăng ký
                                </Button>
                            </Form.Item>

                            <div className="other-login">
                                <Divider>Hoặc đăng ký với</Divider>
                                <Space>
                                    <Button type="default" icon={<UserOutlined />} block>
                                        Google
                                    </Button>
                                    <Button type="default" icon={<UserOutlined />} block>
                                        Facebook
                                    </Button>
                                </Space>
                            </div>

                            <p className='text text-normal' style={{ textAlign: "center" }}>
                                Đã có tài khoản?{" "}
                                <Link to="/login" className='text-link'>
                                    Đăng nhập
                                </Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
