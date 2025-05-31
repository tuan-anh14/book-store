import { useState } from 'react';
import { Form, Input, Button, Select, Upload, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './support.request.scss';

const { Title } = Typography;

const mainIssues = [
    'Bảo hành', 'Bookcare', 'Chat với nhà bán', 'Chat với Tiki', 'Chia sẻ có lời', 'Đặt hàng', 'Đổi trả', 'Đơn hàng', 'Game', 'Giao Hàng', 'Gói quà/ viết thiệp', 'Góp ý', 'Hàng giả/ hàng nhái', 'Hóa đơn', 'Hoàn tiền', 'Khác', 'Khuyến mãi', 'Mua trước - Trả sau', 'Nghi ngờ lừa đảo', 'Nhận xét sản phẩm', 'Phiếu quà tặng', 'Sản Phẩm', 'Tài khoản', 'Thanh toán', 'Thẻ cào/ nạp tiền điện thoại', 'Thẻ Tiki Platinum', 'Thu hồi', 'Tiki Care', 'Astra', 'Tiki Xu', 'Trả góp', 'Trợ lý cá nhân', 'Voucher', 'Website/ App', 'TikiNOW Smart Logistics'
];

const detailIssues = {
    'Gói quà/ viết thiệp': [
        'Tư vấn dịch vụ gói quà/ viết thiệp',
        'Khiếu nại dịch vụ gói quà/viết thiệp',
    ],
    // Có thể bổ sung thêm các vấn đề chi tiết cho các vấn đề chính khác nếu muốn
};

const SupportRequest = () => {
    const [mainIssue, setMainIssue] = useState('Gói quà/ viết thiệp');
    const [form] = Form.useForm();

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
                    <Form.Item style={{ marginBottom: 8 }}>
                        <Select
                            placeholder="Vấn đề hỗ trợ chi tiết"
                            options={(detailIssues[mainIssue] || []).map(i => ({ label: i, value: i }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item label="Địa chỉ email của bạn" name="email" style={{ marginBottom: 8 }}>
                        <Input placeholder="Nhập địa chỉ email" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone" style={{ marginBottom: 8 }}>
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item label="Mã đơn hàng" name="order_number" style={{ marginBottom: 8 }}>
                        <Input.TextArea rows={1} placeholder="Bạn có thể nhập nhiều mã đơn hàng, cách nhau bằng dấu ','" />
                    </Form.Item>
                    <Form.Item label="Tiêu đề" name="subject" style={{ marginBottom: 8 }}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Form.Item label="Nội dung" name="description" style={{ marginBottom: 8 }}>
                        <Input.TextArea rows={5} placeholder="Mô tả chi tiết vấn đề của bạn" />
                    </Form.Item>
                    <Form.Item label="Tập tin đính kèm" name="file_list" style={{ marginBottom: 24 }}>
                        <Upload multiple>
                            <Button icon={<UploadOutlined />}>Thêm tập tin</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="support-request-submit">Gửi</Button>
                </Form>
            </div>
        </main>
    );
};

export default SupportRequest; 