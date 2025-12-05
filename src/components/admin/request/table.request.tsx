import { useRef, useState } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, App, Space } from 'antd';
import { getSupportRequestsAPI, deleteSupportRequestAPI } from '@/services/api';
import DetailRequest from './detail.request';
import { EyeTwoTone, DeleteTwoTone } from '@ant-design/icons';


const TableRequest = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });
    const [openViewDetail, setOpenViewDetail] = useState(false);
    interface SupportRequest {
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
    }

    const [dataViewDetail, setDataViewDetail] = useState<SupportRequest | null>(null);
    const { message, notification } = App.useApp();

    const columns: ProColumns<SupportRequest>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'subject',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'Vấn đề chính ',
            dataIndex: 'mainIssue',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (_, record) => (
                <Tag color={record.status === 'answered' ? 'green' : 'orange'}>
                    {record.status === 'answered' ? 'Đã trả lời' : 'Chờ xử lý'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            width: 100,
            render: (_, entity) => (
                <Space>
                    <EyeTwoTone
                        twoToneColor="#1890ff"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa khiếu nại"}
                        description={"Bạn có chắc chắn muốn xóa khiếu nại này? Hành động này không thể hoàn tác."}
                        onConfirm={() => handleDeleteRequest(entity._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <DeleteTwoTone
                            twoToneColor="#ff4d4f"
                            style={{ cursor: "pointer" }}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleDeleteRequest = async (_id: string) => {
        const res = await deleteSupportRequestAPI(_id);
        if (res && res.data) {
            message.success('Xóa khiếu nại thành công');
            actionRef.current?.reload();
        } else {
            notification.error({
                message: 'Lỗi xoá khiếu nại',
                description: res?.message || 'Đã có lỗi xảy ra.',
            });
        }
    };

    return (
        <>
            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.email) query += `&email=/${params.email}/i`;
                    if (params.subject) query += `&subject=/${params.subject}/i`;
                    if (params.mainIssue) query += `&mainIssue=/${params.mainIssue}/i`;
                    const res = await getSupportRequestsAPI(query);
                    if (res.data) {
                        setMeta({
                            current: params.current ?? 1,
                            pageSize: params.pageSize ?? 5,
                            total: res.data.total ?? 0,
                        });
                    }
                    return {
                        data: res.data?.data,
                        page: params.current,
                        success: true,
                        total: res.data?.total,
                    };
                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                }}
                headerTitle="Quản lý khiếu nại"
                search={{
                    labelWidth: 'auto',
                    span: {
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 8,
                        xl: 8,
                        xxl: 6,
                    },
                }}
                scroll={{ x: true }}
            />
            <DetailRequest
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableRequest; 