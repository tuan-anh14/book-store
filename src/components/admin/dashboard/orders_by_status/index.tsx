import { Card, Spin, Tag } from "antd";
import { ArrowUpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { getOrdersByStatusAPI } from 'services/api';
import './styles.scss';



const COLORS = ['#5AD8A6', '#5B8FF9', '#F6BD16', '#E8684A', '#B37FEB'];

const OrdersByStatus = () => {
    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<Array<{
        status: string;
        count: number;
    }>>([]);

    const fetchOrdersData = async () => {
        setLoading(true);
        try {
            const res = await getOrdersByStatusAPI();
            if (res && res.data) {
                setOrdersData(res.data);
            }
        } catch (error) {
            console.error('Error fetching orders data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersData();
    }, []);

    const formattedData = ordersData.map(item => ({
        name: item.status,
        value: item.count
    }));

    if (loading) {
        return (
            <Card bordered={false} className="orders-by-status">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Orders by status"
            bordered={false}
            extra={<QuestionCircleOutlined />}
            className="orders-by-status"
        >
            <div style={{ height: 400, display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: 16 }}>
                    <Tag color="green" style={{ fontWeight: 500, fontSize: 16 }}>
                        <ArrowUpOutlined /> {ordersData.length} status methods
                    </Tag>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                            {formattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

    );
};

export default OrdersByStatus; 