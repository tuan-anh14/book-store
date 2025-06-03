import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { getRealTimeRevenueAPI } from '@/services/api';

interface RevenueData {
    _id: {
        hour: number;
        minute: number;
    };
    revenue: number;
    orderCount: number;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    data: RevenueData[];
}

const RealTimeRevenue: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RevenueData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getRealTimeRevenueAPI() as ApiResponse;
                console.log("getRealTimeRevenueAPI:", response);
                if (response?.data) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching real-time revenue:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Cập nhật mỗi phút

        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        return `${value.toLocaleString()} VNĐ`;
    };

    // Tính tổng doanh thu và số đơn hàng
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);

    if (loading && data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
            </div>
        );
    }

    return (
        <Card title="Doanh thu thời gian thực">
            <Row gutter={16}>
                <Col span={24}>
                    <Card>
                        <Statistic
                            title="Doanh thu giờ hiện tại"
                            value={totalRevenue}
                            precision={0}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <small>Số đơn hàng: {totalOrders}</small>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default RealTimeRevenue;