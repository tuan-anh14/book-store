import { App, Button, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './verify-email.scss';
import { verifyEmailAPI } from '@/services/api';
import { SafetyOutlined } from '@ant-design/icons';

type FieldType = {
    code: string;
};

const VerifyEmailPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message: messageApi } = App.useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    if (!email) {
        navigate('/register');
        return null;
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        try {
            const res = await verifyEmailAPI(email, values.code);
            if (res.data) {
                messageApi.success('Xác thực email thành công!');
                navigate('/login');
            } else {
                messageApi.error(res.message || 'Có lỗi xảy ra!');
            }
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setIsSubmit(false);
        }
    };

    const handleResendCode = async () => {
        try {
            // TODO: Gọi API gửi lại mã xác thực
            await new Promise(resolve => setTimeout(resolve, 2000));
            messageApi.success('Đã gửi lại mã xác thực, vui lòng kiểm tra email!');
        } catch (error) {
            messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
    };

    return (
        <div className='verify-email-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Xác thực email</h2>
                            <p className='text text-normal'>
                                Vui lòng nhập mã xác thực đã được gửi đến email {email}
                            </p>
                        </div>
                        <Form
                            name='form-verify-email'
                            onFinish={onFinish}
                            autoComplete='off'
                            size='large'
                        >
                            <Form.Item<FieldType>
                                name="code"
                                rules={[{ required: true, message: 'Mã xác thực không được để trống!' }]}
                            >
                                <Input
                                    prefix={<SafetyOutlined className="prefixIcon" />}
                                    placeholder="Nhập mã xác thực"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type='primary' htmlType='submit' loading={isSubmit} block>
                                    Xác thực
                                </Button>
                            </Form.Item>

                            <div className="resend-code">
                                <p className='text text-normal'>
                                    Chưa nhận được mã?{" "}
                                    <Button type="link" onClick={handleResendCode} className='text-link'>
                                        Gửi lại mã
                                    </Button>
                                </p>
                            </div>

                            <p className='text text-normal' style={{ textAlign: "center" }}>
                                <Link to="/login" className='text-link'>
                                    Quay lại đăng nhập
                                </Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default VerifyEmailPage;