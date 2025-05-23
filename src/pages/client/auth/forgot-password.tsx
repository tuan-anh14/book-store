import { App, Button, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './forgot-password.scss';
import { forgotPasswordAPI } from '@/services/api';
import { MailOutlined } from '@ant-design/icons';

type FieldType = {
    email: string;
};

const ForgotPasswordPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message: messageApi } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        try {
            const res = await forgotPasswordAPI(values.email);
            if (res.data) {
                messageApi.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!');
            } else {
                messageApi.error(res.message || 'Có lỗi xảy ra!');
            }
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className='forgot-password-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Quên mật khẩu</h2>
                            <p className='text text-normal'>Nhập email của bạn để đặt lại mật khẩu</p>
                        </div>
                        <Form
                            name='form-forgot-password'
                            onFinish={onFinish}
                            autoComplete='off'
                            size='large'
                        >
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

                            <Form.Item>
                                <Button type='primary' htmlType='submit' loading={isSubmit} block>
                                    Gửi yêu cầu
                                </Button>
                            </Form.Item>

                            <p className='text text-normal' style={{ textAlign: "center" }}>
                                Đã nhớ mật khẩu?{" "}
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

export default ForgotPasswordPage; 