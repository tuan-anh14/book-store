import { Card, Typography, Space, Tag } from "antd";
import { ArrowUpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './styles.scss';

const { Title } = Typography;

const data = [
    { name: 'Thanh toán trực tiếp', value: 15486 },
    { name: 'VNPAY', value: 9000 },
];

const COLORS = ['#5B8FF9', '#5AD8A6'];

const OverallSales = () => {
    return (
        <Card
            title="Overall sales"
            bordered={false}
            extra={<QuestionCircleOutlined />}
            className="overall-sales"
        >
            <div className="ant-flex ant-flex-align-stretch ant-flex-gap-middle ant-flex-vertical">
                <Space align="center">
                    <Title level={3} style={{ margin: 0 }}>$ <span>24,486</span></Title>
                    <Tag color="green" style={{ fontWeight: 500, fontSize: 16 }}>
                        <ArrowUpOutlined /> 8.7%
                    </Tag>
                </Space>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value">
                                {data.map((entry, index) => (
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