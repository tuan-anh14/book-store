import { getOrdersAPI, updateOrderAPI } from "@/services/api";
import { dateRangeValidate } from '@/services/helper';
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { Select, message, Tag } from 'antd';

type TSearch = {
    name: string;
    address: string;
    createdAt: string,
    createdAtRange: string,
};

const ORDER_STATUS = {
    PENDING: { value: 'PENDING', color: 'gold', label: 'Chờ xử lý' },
    PROCESSING: { value: 'PROCESSING', color: 'blue', label: 'Đang xử lý' },
    SHIPPED: { value: 'SHIPPED', color: 'cyan', label: 'Đã gửi hàng' },
    DELIVERED: { value: 'DELIVERED', color: 'green', label: 'Đã giao hàng' },
    CANCELLED: { value: 'CANCELLED', color: 'red', label: 'Đã hủy' }
};

const TableOrder = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderAPI(orderId, { status: newStatus });
            message.success('Cập nhật trạng thái thành công');
            actionRef.current?.reload();
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: "index",
            valueType: "indexBorder",
            width: 48,
        },
        {
            title: "Id",
            dataIndex: "_id",
            search: false,
            render: (_, record) => <a>{record._id}</a>,
        },
        {
            title: "Full Name",
            dataIndex: "name",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "Giá tiền",
            dataIndex: "totalPrice",
            search: false,
            render: (_, record) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(record.totalPrice),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, record) => (
                <Select
                    value={record.status}
                    style={{ width: 150 }}
                    onChange={(value) => handleUpdateStatus(record._id, value)}
                    options={Object.values(ORDER_STATUS).map(status => ({
                        value: status.value,
                        label: <Tag color={status.color}>{status.label}</Tag>
                    }))}
                />
            ),
            renderText: (status) => {
                const statusConfig = Object.values(ORDER_STATUS).find(s => s.value === status);
                return statusConfig ? statusConfig.label : status;
            }
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "date",
            search: false,
            sorter: true,
        },
    ];

    return (
        <ProTable<IOrderTable, TSearch>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {

                let query = "";

                if (params) {
                    query += `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.name) {
                        query += `&mainText=/${params.name}/i`;
                    }
                }

                const createDateRange = dateRangeValidate(params.createdAtRange);
                if (createDateRange) {
                    query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                }

                //default

                if (sort && sort.createdAt) {
                    query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                } else {
                    query += "&sort=-createdAt";
                }

                const res = await getOrdersAPI(query);
                if (res.data) {
                    setMeta(res.data.meta);
                }
                return {
                    data: res.data?.result,
                    page: 1,
                    success: true,
                    total: res.data?.meta.total
                };

            }}
            pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                showSizeChanger: true,
                total: meta.total,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} trên ${total} rows`,
            }}

            headerTitle="Table Orders"
        />
    );
};

export default TableOrder;
