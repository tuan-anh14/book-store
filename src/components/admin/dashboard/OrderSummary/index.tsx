import { Card, Statistic, Space, Typography, Spin } from "antd";
import { ArrowUpOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getTotalRevenueAPI } from 'services/api';
import './styles.scss';

const { Text } = Typography;

const OrderSummary = () => {
    const [loading, setLoading] = useState(false);
    const [revenue, setRevenue] = useState<number>(0);

    const fetchRevenue = async () => {
        setLoading(true);
        try {
            const res = await getTotalRevenueAPI();
            if (res && res.data) {
                setRevenue(res.data.totalRevenue);
            }
        } catch (error) {
            console.error('Error fetching revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, []);

    if (loading) {
        return (
            <Card bordered={false} className="order-summary">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card title="Revenue" bordered={false} className="order-summary">
            <Statistic
                value={revenue}
                suffix={" VNĐ"}
                valueStyle={{ fontSize: 32, fontWeight: 700 }}
            />
            <Space style={{ color: 'rgb(56, 158, 13)', marginTop: 8 }}>
                <ArrowUpOutlined />
                <Text style={{ color: 'rgb(56, 158, 13)', fontWeight: 500, margin: 0 }}>
                    {revenue > 0 ? 'Active' : 'No orders'}
                </Text>
            </Space>
        </Card>
    );
};

export default OrderSummary; 