import React, { useEffect, useState } from 'react';
import { Card, Select, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getRevenueTrendsAPI } from '@/services/api';

const { Option } = Select;

interface RevenueData {
    time: {
        hour?: number;
        day?: number;
    };
    revenue: number;
    orderCount: number;
    averageOrderValue: number;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    data: RevenueData[];
}

const RevenueTrends: React.FC = () => {
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RevenueData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getRevenueTrendsAPI(period) as ApiResponse;
                console.log("getRevenueTrendsAPI:", response);
                if (response?.data) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching revenue trends:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period]);

    const formatTimeLabel = (time: any) => {
        if (!time) return '';

        if (period === 'day') {
            return time.hour !== undefined ? `Giờ ${time.hour}` : '';
        }
        return time.day !== undefined ? `Ngày ${time.day}` : '';
    };

    const formatCurrency = (value: number) => {
        return `${value.toLocaleString()} VNĐ`;
    };

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = data.map(item => ({
        ...item,
        timeLabel: formatTimeLabel(item.time)
    }));

    return (
        <Card
            title="Xu hướng doanh thu"
            extra={
                <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
                    <Option value="day">Theo giờ</Option>
                    <Option value="week">Theo ngày</Option>
                    <Option value="month">Theo tháng</Option>
                </Select>
            }
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timeLabel"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip
                            formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                            labelFormatter={(label) => label}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            name="Doanh thu"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
};

export default RevenueTrends; 