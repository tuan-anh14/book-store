import { Drawer, Descriptions, Divider, Tag, Image, Button, Form, Input, Upload, message, Grid } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { updateSupportRequestAPI, uploadFileAPI } from '@/services/api';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

interface DetailRequestProps {
    openViewDetail: boolean;
    setOpenViewDetail: (open: boolean) => void;
    dataViewDetail: {
        _id: string;
        email: string;
        phone: string;
        mainIssue: string;
        detailIssue?: string;
        order_number?: string;
        subject: string;
        description: string;
        status: string;
        createdAt?: string;
        file_list?: string[];
        adminReply?: string;
        adminReplyImages?: string[];
    } | null;
    setDataViewDetail: (data: DetailRequestProps['dataViewDetail']) => void;
}

const DetailRequest = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }: DetailRequestProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
        form.resetFields();
        setFileList([]);
        setUploadedImageUrls([]);
    };

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess, onError, file, onProgress } = options;
        const uploadFile = file as File;

        try {
            // Show upload progress
            if (onProgress) {
                onProgress({ percent: 0 });
            }

            const res = await uploadFileAPI(uploadFile, 'admin');

            if (res?.data?.url) {
                const cloudinaryUrl = res.data.url;
                setUploadedImageUrls(prev => [...prev, cloudinaryUrl]);

                // Update fileList with Cloudinary URL
                setFileList(prev => prev.map(f =>
                    f.uid === (file as UploadFile).uid
                        ? { ...f, url: cloudinaryUrl, status: 'done', name: cloudinaryUrl }
                        : f
                ));

                if (onProgress) {
                    onProgress({ percent: 100 });
                }

                if (onSuccess) {
                    onSuccess('ok');
                }
            } else {
                throw new Error('Upload failed: No URL returned');
            }
        } catch (error) {
            message.error('Upload ảnh thất bại!');
            setFileList(prev => prev.filter(f => f.uid !== (file as UploadFile).uid));
            if (onError) {
                onError(error instanceof Error ? error : new Error('Upload failed'));
            }
        }
    };

    const handleSubmit = async (values: { adminReply: string }) => {
        if (!dataViewDetail) return;

        try {
            setLoading(true);

            // Get all Cloudinary URLs from uploaded images
            const imageUrls = uploadedImageUrls.filter(url => url);

            // Create FormData with Cloudinary URLs
            const formData = new FormData();
            formData.append('adminReply', values.adminReply);
            imageUrls.forEach((url) => {
                formData.append('adminReplyImages', url);
            });

            const res = await updateSupportRequestAPI(dataViewDetail._id, formData);

            if (res.data) {
                message.success('Gửi phản hồi thành công');
                setDataViewDetail({ ...dataViewDetail, ...res.data });
                form.resetFields();
                setFileList([]);
                setUploadedImageUrls([]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Chi tiết khiếu nại khách hàng"
            width={screens.md ? 600 : "100%"}
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
                                    onChange={({ fileList: newFileList }) => {
                                        setFileList(newFileList);
                                        // Remove URLs for removed files
                                        const currentUrls = newFileList
                                            .map(f => f.url)
                                            .filter((url): url is string => Boolean(url));
                                        setUploadedImageUrls(currentUrls);
                                    }}
                                    onRemove={(file) => {
                                        setFileList(prev => prev.filter(f => f.uid !== file.uid));
                                        if (file.url) {
                                            setUploadedImageUrls(prev => prev.filter(url => url !== file.url));
                                        }
                                        return true;
                                    }}
                                    customRequest={handleUploadFile}
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