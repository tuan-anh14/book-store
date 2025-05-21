import { App, Button, Divider, Form, Input, Space, theme } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { loginAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';
import {
    AlipayCircleOutlined,
    LockOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import { setAlpha } from '@ant-design/pro-components';

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();
    const { token } = theme.useToken();

    const iconStyles = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);

        setTimeout(async () => {
            const res = await loginAPI(username, password);

            if (res?.data) {
                setIsAuthenticated(true);
                setUser(res.data.user);
                localStorage.setItem('access_token', res.data.access_token);
                message.success("Đăng nhập thành công.");
                navigate("/");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                });
            }

            setIsSubmit(false);
        }, 2000);
    };

    return (
        <div className='login-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng nhập</h2>
                            <p className='text text-normal'>Chào mừng bạn đến với BookStore</p>
                        </div>
                        <Form
                            name='form-login'
                            onFinish={onFinish}
                            autoComplete='off'
                            size='large'
                        >
                            <Form.Item<FieldType>
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined className="prefixIcon" />}
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

                            <Form.Item>
                                <Button type='primary' htmlType='submit' loading={isSubmit} block>
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <div className="other-login">
                                <Divider>Hoặc đăng nhập với</Divider>
                                <Space>
                                    <AlipayCircleOutlined style={iconStyles} />
                                    <WeiboCircleOutlined style={iconStyles} />
                                </Space>
                            </div>

                            <p className='text text-normal' style={{ textAlign: "center" }}>
                                Chưa có tài khoản? {" "}
                                <Link to="/register" className='text-link'>
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
