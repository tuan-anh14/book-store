import { deleteCommentAPI, getAllCommentsAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { DeleteTwoTone, EyeTwoTone } from '@ant-design/icons';
import DetailComment from './detail.comment';

type TSearch = {
    content: string;
    user: string;
    book: string;
    createdAt: string;
    createdAtRange: string;
}

const TableComment = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<ICommentTable | null>(null);
    const [isDeleteComment, setIsDeleteComment] = useState<boolean>(false);

    const { message, notification } = App.useApp();

    const handleDeleteComment = async (_id: string) => {
        setIsDeleteComment(true);
        const res = await deleteCommentAPI(_id);
        if (res && res.data) {
            message.success('Xóa bình luận thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi xoá bình luận',
                description: res?.message || 'Đã có lỗi xảy ra.',
            });
        }
        setIsDeleteComment(false);
    };

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<ICommentTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(entity);
                        setOpenViewDetail(true);
                    }}>{entity._id}</a>
                )
            },
        },
        {
            title: 'User',
            dataIndex: 'user.fullName',
            valueType: 'text',
            render: (_, record) => record.user?.fullName || '',
            sorter: true,
        },
        {
            title: 'Book',
            dataIndex: 'book.mainText',
            valueType: 'text',
            render: (_, record) => record.book?.mainText || '',
            sorter: true,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Star',
            dataIndex: 'star',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            width: 100,
            render(dom, entity) {
                return (
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
                            title={"Xác nhận xóa bình luận"}
                            description={"Bạn có chắc chắn muốn xóa bình luận này ?"}
                            onConfirm={() => handleDeleteComment(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ];

    return (
        <>
            <ProTable<ICommentTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = '';

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.content) {
                            query += `&content=/${params.content}/i`;
                        }
                        if (params.user) {
                            query += `&user.fullName=/${params.user}/i`;
                        }
                        if (params.book) {
                            query += `&book.mainText=/${params.book}/i`;
                        }
                    }

                    if (sort) {
                        const sortField = Object.keys(sort)[0];
                        const sortOrder = sort[sortField];
                        if (sortField && sortOrder) {
                            query += `&sort=${sortOrder === "ascend" ? sortField : `-${sortField}`}`;
                        }
                    } else {
                        query += "&sort=-createdAt";
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

            <DetailComment
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableComment; 