import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Typography, message, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './support.request.scss';
import { createSupportRequestAPI, uploadFileAPI, getHistoryAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';
import { IHistory } from '@/types/history';

const { Title } = Typography;

const mainIssues = [
    'Bảo hành', 'Bookcare', 'Chat với nhà bán', 'Chat với Tiki', 'Chia sẻ có lời', 'Đặt hàng', 'Đổi trả', 'Đơn hàng', 'Game', 'Giao Hàng', 'Gói quà/ viết thiệp', 'Góp ý', 'Hàng giả/ hàng nhái', 'Hóa đơn', 'Hoàn tiền', 'Khác', 'Khuyến mãi', 'Mua trước - Trả sau', 'Nghi ngờ lừa đảo', 'Nhận xét sản phẩm', 'Phiếu quà tặng', 'Sản Phẩm', 'Tài khoản', 'Thanh toán', 'Thẻ cào/ nạp tiền điện thoại', 'Thẻ Tiki Platinum', 'Thu hồi', 'Tiki Care', 'Astra', 'Tiki Xu', 'Trả góp', 'Trợ lý cá nhân', 'Voucher', 'Website/ App', 'TikiNOW Smart Logistics'
];

const detailIssues: { [key: string]: string[] } = {
    'Gói quà/ viết thiệp': [
        'Tư vấn dịch vụ gói quà/ viết thiệp',
        'Khiếu nại dịch vụ gói quà/viết thiệp',
    ],
    // Có thể bổ sung thêm các vấn đề chi tiết cho các vấn đề chính khác nếu muốn
};

const SupportRequest = () => {
    const [mainIssue, setMainIssue] = useState('Gói quà/ viết thiệp');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [userOrders, setUserOrders] = useState<IHistory[]>([]);
    const { notification } = App.useApp();
    const { user } = useCurrentApp();

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user?._id) {
                try {
                    const res = await getHistoryAPI();
                    if (res && res.data) {
                        // @ts-ignore: Unreachable code error
                        setUserOrders(res.data);
                    }
                } catch (error) {
                    console.error('Error fetching user orders:', error);
                    notification.error({ message: 'Không thể lấy danh sách đơn hàng' });
                }
            }
        };
        fetchUserOrders();
    }, [user]);

    const beforeUpload = (file: File) => {
        const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPngOrWebp) {
            notification.error({ message: 'Chỉ cho phép upload file JPG/PNG/WebP!' });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notification.error({ message: 'Ảnh phải nhỏ hơn 2MB!' });
        }
        return isJpgOrPngOrWebp && isLt2M || Upload.LIST_IGNORE;
    };

    const handleUploadFile = async (file: File) => {
        setLoadingUpload(true);
        try {
            const res = await uploadFileAPI(file, 'support');
            if (res?.data?.fileName) {
                const url = `${import.meta.env.VITE_BACKEND_URL}/images/support/${res.data.fileName}`;
                setImageUrls(prev => [...prev, url]);
                notification.success({ message: 'Upload ảnh thành công!' });
            }
        } catch {
            notification.error({ message: 'Upload ảnh thất bại!' });
        }
        setLoadingUpload(false);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setTimeout(async () => {
            try {
                await createSupportRequestAPI({
                    ...values,
                    mainIssue,
                    file_list: imageUrls,
                });

                notification.success({ message: 'Gửi khiếu nại thành công! Chúng tôi sẽ phản hồi qua email.' });
                form.resetFields();
                setImageUrls([]);
            } catch (error) {
                notification.error({ message: 'Gửi khiếu nại thất bại. Vui lòng thử lại!' });
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    return (
        <main className="support-request-main">
            <div className="container-divider"></div>
            <div className="support-request-container">
                <Title level={1} className="title">Đội ngũ chăm sóc khách hàng Book Store</Title>
                <p>Tiki luôn sẵn sàng lắng nghe câu hỏi và ý kiến đóng góp từ bạn. Chúng tôi sẽ phản hồi ngay trong 24h tiếp theo!</p>
                <Form
                    form={form}
                    layout="vertical"
                    className="support-request-form"
                    onFinish={handleSubmit}
                >
                    <Form.Item label={<b>Hãy chọn vấn đề bên dưới nhé</b>} style={{ marginBottom: 8 }}>
                        <Select
                            value={mainIssue}
                            onChange={setMainIssue}
                            options={mainIssues.map(i => ({ label: i, value: i }))}
                            style={{ width: '100%' }}
                            placeholder="Vấn đề hỗ trợ chính"
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 8 }} name="detailIssue">
                        <Select
                            placeholder="Vấn đề hỗ trợ chi tiết"
                            options={(detailIssues[mainIssue] || []).map((i: string) => ({ label: i, value: i }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item label="Địa chỉ email của bạn" name="email" style={{ marginBottom: 8 }} rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                        <Input placeholder="Nhập địa chỉ email" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone" style={{ marginBottom: 8 }} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item label="Mã đơn hàng" name="order_number" style={{ marginBottom: 8 }}>
                        <Select
                            placeholder="Chọn đơn hàng của bạn"
                            allowClear
                            options={userOrders.map((order: any) => ({
                                label: `Đơn hàng #${order._id.slice(-6)} - ${order.totalPrice.toLocaleString('vi-VN')}đ - ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`,
                                value: order._id
                            }))}
                            loading={loading}
                        />
                    </Form.Item>
                    <Form.Item label="Tiêu đề" name="subject" style={{ marginBottom: 8 }} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Form.Item label="Nội dung" name="description" style={{ marginBottom: 8 }} rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                        <Input.TextArea rows={5} placeholder="Mô tả chi tiết vấn đề của bạn" />
                    </Form.Item>
                    <Form.Item label="Tập tin đính kèm" style={{ marginBottom: 24 }}>
                        <Upload
                            name="file"
                            customRequest={({ file }) => handleUploadFile(file as File)}
                            showUploadList={false}
                            accept="image/*"
                            beforeUpload={beforeUpload}
                            disabled={loadingUpload}
                        >
                            <Button icon={<UploadOutlined />} loading={loadingUpload}>Thêm tập tin</Button>
                        </Upload>
                        <div style={{ marginTop: 8 }}>
                            {imageUrls.map((url, idx) => (
                                <div key={idx} style={{ display: 'inline-block', marginRight: 8, position: 'relative' }}>
                                    <img src={url} alt="uploaded" width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                                    <Button
                                        size="small"
                                        danger
                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                        onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                    >x</Button>
                                </div>
                            ))}
                        </div>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="support-request-submit" loading={loading}>Gửi</Button>
                </Form>
            </div>
        </main>
    );
};

export default SupportRequest; 