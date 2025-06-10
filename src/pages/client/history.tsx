import { useEffect, useState } from "react";
import { App, Divider, Drawer, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";
import { getUserOrdersAPI } from "@/services/api";

const ORDER_STATUS = {
    PENDING: { value: 'PENDING', color: 'gold', label: 'Chờ xử lý' },
    PROCESSING: { value: 'PROCESSING', color: 'blue', label: 'Đang xử lý' },
    SHIPPED: { value: 'SHIPPED', color: 'cyan', label: 'Đã gửi hàng' },
    DELIVERED: { value: 'DELIVERED', color: 'green', label: 'Đã giao hàng' },
    CANCELLED: { value: 'CANCELLED', color: 'red', label: 'Đã hủy' }
};

const HistoryPage = () => {
    const columns: TableProps<IOrderTable>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_item, _record, index) => <>{index + 1}</>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (item) => {
                return (
                    dayjs(item).format(FORMATE_DATE_VN)
                )
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item);
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const statusInfo = ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS.PENDING;
                return (
                    <Tag color={statusInfo.color}>
                        {statusInfo.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <a onClick={() => {
                    setOpenDetail(true);
                    setDataDetail(record);
                }} href="#">Xem chi tiết</a>
            ),
        },
    ];

    const [dataOrders, setDataOrders] = useState<IOrderTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IOrderTable | null>(null);

    const { notification } = App.useApp();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getUserOrdersAPI();
                if (res?.data?.result) {
                    setDataOrders(res.data.result);
                }
            } catch (error: any) {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: error.message,
                });
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div style={{ margin: 50 }}>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Lịch sử đơn hàng</div>
            <Divider />
            <Table
                bordered
                columns={columns}
                dataSource={dataOrders}
                rowKey="_id"
                loading={loading}
            />
            <Drawer
                title="Chi tiết đơn hàng"
                onClose={() => {
                    setOpenDetail(false);
                    setDataDetail(null);
                }}
                open={openDetail}
            >
                {dataDetail?.detail?.map((item, index) => {
                    return (
                        <ul key={index}>
                            <li>
                                Tên sách: {item.bookName}
                            </li>
                            <li>
                                Số lượng: {item.quantity}
                            </li>
                            <Divider />
                        </ul>
                    );
                })}
            </Drawer>
        </div>
    );
}

export default HistoryPage;