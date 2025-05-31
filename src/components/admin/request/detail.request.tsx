import { Drawer, Descriptions, Divider, Tag, Image, Button } from 'antd';

const DetailRequest = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }: any) => {
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Drawer
            title="Chi tiết khiếu nại khách hàng"
            width={600}
            onClose={onClose}
            open={openViewDetail}
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
                    </Descriptions>
                </>
            )}
        </Drawer>
    );
};

export default DetailRequest; 