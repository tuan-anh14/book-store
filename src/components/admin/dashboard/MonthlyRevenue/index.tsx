import { Card, Typography, Space, Tag } from "antd";
import { ArrowUpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './styles.scss';

const { Title } = Typography;

// Dữ liệu mẫu cho 12 tháng
const data = [
    { month: 'Jan', onlineStore: 1500, facebook: 800 },
    { month: 'Feb', onlineStore: 1800, facebook: 900 },
    { month: 'Mar', onlineStore: 2000, facebook: 1000 },
    { month: 'Apr', onlineStore: 2200, facebook: 1100 },
    { month: 'May', onlineStore: 1700, facebook: 1200 },
    { month: 'Jun', onlineStore: 1900, facebook: 1300 },
    { month: 'Jul', onlineStore: 2100, facebook: 1400 },
    { month: 'Aug', onlineStore: 2300, facebook: 1500 },
    { month: 'Sep', onlineStore: 2400, facebook: 1600 },
    { month: 'Oct', onlineStore: 2600, facebook: 1700 },
    { month: 'Nov', onlineStore: 2800, facebook: 1800 },
    { month: 'Dec', onlineStore: 3000, facebook: 1900 },
];

const MonthlyRevenue = () => {
    // Tính tổng doanh thu
    const totalRevenue = data.reduce((sum, item) => sum + item.onlineStore + item.facebook, 0);

    // Tính phần trăm tăng trưởng (ví dụ: so với tháng trước)
    const growthRate = 8.7;

    return (
        <Card
            title="Monthly Revenue"
            bordered={false}
            extra={<QuestionCircleOutlined />}
            className="monthly-revenue"
        >
            <div className="ant-flex ant-flex-align-stretch ant-flex-gap-middle ant-flex-vertical">
                <Space align="center">
                    <Title level={3} style={{ margin: 0 }}>vnđ <span>{totalRevenue.toLocaleString()}</span></Title>
                    <Tag color="green" style={{ fontWeight: 500, fontSize: 16 }}>
                        <ArrowUpOutlined /> {growthRate}%
                    </Tag>
                </Space>
                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="onlineStore"
                                name="Online Store"
                                stroke="#5B8FF9"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="facebook"
                                name="Facebook"
                                stroke="#5AD8A6"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default MonthlyRevenue; 