import React, { useEffect, useState } from 'react';
import { Card, Select, Table, Spin } from 'antd';
import { getTopSellingProductsAPI } from '@/services/api';

const { Option } = Select;

interface ProductData {
    _id: string;
    bookName: string;
    totalQuantity: number;
    totalRevenue: number;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    data: ProductData[];
}

const TopSellingProducts: React.FC = () => {
    const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week' | 'month' | 'all'>('day');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProductData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getTopSellingProductsAPI(timeframe) as ApiResponse;
                console.log("getTopSellingProductsAPI:", response);
                if (response?.data) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching top selling products:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timeframe]);

    const formatCurrency = (value: number) => {
        return `${value.toLocaleString()} VNĐ`;
    };

    const columns = [
        {
            title: 'Tên sách',
            dataIndex: 'bookName',
            key: 'bookName',
        },
        {
            title: 'Số lượng bán',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            sorter: (a: ProductData, b: ProductData) => a.totalQuantity - b.totalQuantity,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (value: number) => formatCurrency(value),
            sorter: (a: ProductData, b: ProductData) => a.totalRevenue - b.totalRevenue,
        },
    ];

    return (
        <Card
            title="Sản phẩm bán chạy nhất"
            extra={
                <Select value={timeframe} onChange={setTimeframe} style={{ width: 120 }}>
                    <Option value="hour">1 giờ gần nhất</Option>
                    <Option value="day">Hôm nay</Option>
                    <Option value="week">Tuần này</Option>
                    <Option value="month">Tháng này</Option>
                    <Option value="all">Tất cả</Option>
                </Select>
            }
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            ) : (
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            )}
        </Card>
    );
};

export default TopSellingProducts; 