import { Drawer, Descriptions, Divider, Tag, Image, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { updateSupportRequestAPI } from '@/services/api';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const DetailRequest = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }: any) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
        form.resetFields();
        setFileList([]);
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('adminReply', values.adminReply);
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('adminReplyImages', file.originFileObj);
                }
            });

            console.log('Nội dung phản hồi:', values.adminReply);
            console.log('Số lượng ảnh đính kèm:', fileList.length);

            const res = await updateSupportRequestAPI(dataViewDetail._id, formData);
            console.log('Response từ server:', res.data);

            if (res.data) {
                message.success('Gửi phản hồi thành công');
                setDataViewDetail({ ...dataViewDetail, ...res.data });
                form.resetFields();
                setFileList([]);
            }
        } catch (error: any) {
            console.error('Lỗi khi gửi phản hồi:', error);
            message.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Chi tiết khiếu nại khách hàng"
            width={600}
            onClose={onClose}
            open={openViewDetail}
            extra={
                dataViewDetail?.status !== 'answered' && (
                    <Button type="primary" onClick={() => form.submit()} loading={loading}>
                        Gửi phản hồi
                    </Button>
                )
            }
        >
            {dataViewDetail && (
                <>
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Email">{dataViewDetail.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{dataViewDetail.phone}</Descriptions.Item>
                        <Descriptions.Item label="Vấn đề chính">{dataViewDetail.mainIssue}</Descriptions.Item>
                        <Descriptions.Item label="Vấn đề chi tiết">{dataViewDetail.detailIssue}</Descriptions.Item>
                        <Descriptions.Item label="Mã đơn hàng">{dataViewDetail.order_number}</Descriptions.Item>
                        <Descriptions.Item label="Tiêu đề">{dataViewDetail.subject}</Descriptions.Item>
                        <Descriptions.Item label="Nội dung">{dataViewDetail.description}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={dataViewDetail.status === 'answered' ? 'green' : 'orange'}>
                                {dataViewDetail.status === 'answered' ? 'Đã trả lời' : 'Chờ xử lý'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {dataViewDetail.createdAt ? new Date(dataViewDetail.createdAt).toLocaleString() : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ảnh đính kèm">
                            {dataViewDetail.file_list && dataViewDetail.file_list.length > 0 ? (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {dataViewDetail.file_list.map((url: string, idx: number) => (
                                        <Image key={idx} src={url} width={80} style={{ border: '1px solid #eee', borderRadius: 4 }} />
                                    ))}
                                </div>
                            ) : (
                                <span style={{ color: '#888' }}>Không có ảnh</span>
                            )}
                        </Descriptions.Item>
                        {dataViewDetail.adminReply && (
                            <Descriptions.Item label="Phản hồi của admin">
                                <div style={{ color: '#1677ff' }}>{dataViewDetail.adminReply}</div>
                            </Descriptions.Item>
                        )}
                        {dataViewDetail.adminReplyImages && dataViewDetail.adminReplyImages.length > 0 && (
                            <Descriptions.Item label="Ảnh phản hồi">
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {dataViewDetail.adminReplyImages.map((url: string, idx: number) => (
                                        <Image key={idx} src={url} width={80} style={{ border: '1px solid #eee', borderRadius: 4 }} />
                                    ))}
                                </div>
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    {dataViewDetail.status !== 'answered' && (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            style={{ marginTop: 24 }}
                        >
                            <Form.Item
                                name="adminReply"
                                label="Nội dung phản hồi"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nhập nội dung phản hồi..."
                                    onChange={(e) => console.log('Nội dung đang nhập:', e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item label="Ảnh đính kèm">
                                <Upload
                                    listType="picture"
                                    maxCount={5}
                                    fileList={fileList}
                                    onChange={({ fileList }) => {
                                        console.log('Danh sách file đã chọn:', fileList);
                                        setFileList(fileList);
                                    }}
                                    beforeUpload={() => false}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Form>
                    )}
                </>
            )}
        </Drawer>
    );
};

export default DetailRequest; 