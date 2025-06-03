import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { getSalesPerformanceAPI } from '@/services/api';

interface PerformanceData {
    daily: Array<{ revenue: number; orderCount: number }>;
    weekly: Array<{ revenue: number; orderCount: number }>;
    monthly: Array<{ revenue: number; orderCount: number }>;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    data: PerformanceData[];
}

const SalesPerformance: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PerformanceData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getSalesPerformanceAPI() as ApiResponse;
                console.log("getSalesPerformanceAPI:", response);
                if (response?.data?.[0]) {
                    setData(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching sales performance:', error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return `${value.toLocaleString()} VNĐ`;
    };

    if (loading && !data) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
            </div>
        );
    }

    return (
        <Card title="Hiệu suất bán hàng">
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu ngày"
                            value={data?.daily?.[0]?.revenue || 0}
                            precision={0}
                            //@ts-ignore
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <small>Số đơn hàng: {data?.daily?.[0]?.orderCount || 0}</small>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu tuần"
                            value={data?.weekly?.[0]?.revenue || 0}
                            precision={0}
                            //@ts-ignore
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <small>Số đơn hàng: {data?.weekly?.[0]?.orderCount || 0}</small>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng"
                            value={data?.monthly?.[0]?.revenue || 0}
                            precision={0}
                            //@ts-ignore
                            formatter={(value) => formatCurrency(value)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <small>Số đơn hàng: {data?.monthly?.[0]?.orderCount || 0}</small>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default SalesPerformance; 