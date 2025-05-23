import { Card, Typography, Space, Tag, Spin } from "antd";
import { ArrowUpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { getMonthlyRevenueAPI } from 'services/api';
import './styles.scss';

const { Title } = Typography;

const COLORS = ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E8684A', '#B37FEB', '#6DC8EC', '#FF9D4D', '#269A99', '#FF99C3', '#A0D911', '#FF85C0', '#722ED1'];

const MonthlyRevenue = () => {
    const [loading, setLoading] = useState(false);
    const [monthlyData, setMonthlyData] = useState<Array<{
        month: string;
        revenue: number;
    }>>([]);

    const fetchMonthlyRevenue = async () => {
        setLoading(true);
        try {
            const res = await getMonthlyRevenueAPI();
            if (res && res.data) {
                setMonthlyData(res.data);
            }
        } catch (error) {
            console.error('Error fetching monthly revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlyRevenue();
    }, []);

    // Tính tổng doanh thu
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);

    // Tính phần trăm tăng trưởng (so với tháng trước)
    const currentMonth = new Date().getMonth();
    const currentMonthRevenue = monthlyData[currentMonth]?.revenue || 0;
    const previousMonthRevenue = monthlyData[currentMonth - 1]?.revenue || 0;
    const growthRate = previousMonthRevenue ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <Card bordered={false} className="monthly-revenue">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Monthly Revenue"
            bordered={false}
            extra={<QuestionCircleOutlined />}
            className="monthly-revenue"
        >
            <div className="ant-flex ant-flex-align-stretch ant-flex-gap-middle ant-flex-vertical">
                <Space align="center">
                    <Title level={3} style={{ margin: 0 }}><span>{totalRevenue.toLocaleString()}</span> VNĐ</Title>
                    <Tag color="green" style={{ fontWeight: 500, fontSize: 16 }}>
                        <ArrowUpOutlined /> {growthRate}%
                    </Tag>
                </Space>
                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue">
                                {monthlyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default MonthlyRevenue; 