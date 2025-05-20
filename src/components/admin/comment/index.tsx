import { getAllCommentsAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';

const TableComment = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const columns: ProColumns<ICommentTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            search: false,
            render: (_, record) => <a>{record._id}</a>,
        },
        {
            title: 'User',
            dataIndex: ['user', 'fullName'],
            render: (_, record) => record.user?.fullName || '',
        },
        {
            title: 'Book',
            dataIndex: ['book', 'mainText'],
            render: (_, record) => record.book?.mainText || '',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            ellipsis: true,
        },
        {
            title: 'Star',
            dataIndex: 'star',
            search: false,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            search: false,
            render: (_, record) => record.image ? <img src={record.image} alt="img" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : null,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            search: false,
            sorter: true,
        },
    ];

    return (
        <ProTable<ICommentTable>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                let query = '';
                if (params) {
                    query += `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.user) {
                        query += `&user=${params.user}`;
                    }
                    if (params.book) {
                        query += `&book=${params.book}`;
                    }
                }
                if (sort && sort.createdAt) {
                    query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                } else {
                    query += '&sort=-createdAt';
                }
                const res = await getAllCommentsAPI(query);
                if (res.data) {
                    setMeta(res.data.meta);
                }
                return {
                    data: res.data?.result,
                    page: 1,
                    success: true,
                    total: res.data?.meta.total,
                };
            }}
            pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                showSizeChanger: true,
                total: meta.total,
                showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} rows`,
            }}
            headerTitle="Table Comments"
        />
    );
};

export default TableComment; 