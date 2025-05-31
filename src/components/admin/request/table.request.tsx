import { useRef, useState } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, App } from 'antd';
import { getSupportRequestsAPI } from '@/services/api';
import DetailRequest from './detail.request';

const TableRequest = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<any>(null);
    const { message, notification } = App.useApp();

    const columns: ProColumns<any>[] = [
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
            title: 'Vấn đề chính',
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
                <>
                    <Button
                        size="small"
                        type="link"
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </>
            ),
        },
    ];

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
                            current: params.current,
                            pageSize: params.pageSize,
                            total: res.data.total,
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