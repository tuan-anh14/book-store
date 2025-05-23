import { Card, Typography, Space, Tag, Spin } from "antd";
import { ArrowUpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { getOverallSalesAPI } from 'services/api';
import './styles.scss';

const { Title } = Typography;

const COLORS = ['#5B8FF9', '#5AD8A6'];

const OverallSales = () => {
    const [loading, setLoading] = useState(false);
    const [salesData, setSalesData] = useState<Array<{
        type: string;
        totalAmount: number;
        count: number;
    }>>([]);

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const res = await getOverallSalesAPI();
            if (res && res.data) {
                setSalesData(res.data);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    const totalAmount = salesData.reduce((sum, item) => sum + item.totalAmount, 0);
    const formattedData = salesData.map(item => ({
        name: item.type,
        value: item.totalAmount
    }));

    if (loading) {
        return (
            <Card bordered={false} className="overall-sales">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Overall sales"
            bordered={false}
            extra={<QuestionCircleOutlined />}
            className="overall-sales"
        >
            <div className="ant-flex ant-flex-align-stretch ant-flex-gap-middle ant-flex-vertical">
                <Space align="center">
                    <Title level={3} style={{ margin: 0 }}><span>{totalAmount.toLocaleString()}</span> VNĐ</Title>
                    <Tag color="green" style={{ fontWeight: 500, fontSize: 16 }}>
                        <ArrowUpOutlined /> {salesData.length} payment methods
                    </Tag>
                </Space>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
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
            </div>
        </Card>
    );
};

export default OverallSales; 