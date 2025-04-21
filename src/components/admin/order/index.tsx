import { getOrdersAPI } from "@/services/api";
import { dateRangeValidate } from '@/services/helper';
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";

type TSearch = {
    name: string;
    address: string;
    createdAt: string,
    createdAtRange: string,
};

const TableOrder = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

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
