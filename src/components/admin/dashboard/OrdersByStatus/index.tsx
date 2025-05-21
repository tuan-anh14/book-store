import { Card } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './styles.scss';

const data = [
    { name: 'Pending', value: 55 },
    { name: 'Completed', value: 120 },
    { name: 'Cancelled', value: 15 },
    { name: 'Shipping', value: 30 },
    { name: 'Refunded', value: 8 },
];

const COLORS = ['#5AD8A6', '#5B8FF9', '#F6BD16', '#E8684A', '#B37FEB'];

const OrdersByStatus = () => {
    return (
        <Card
            title="Orders by status"
            bordered={false}
            extra={<QuestionCircleOutlined />}
            className="orders-by-status"
        >
            <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height={400}>
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
        </Card>
    );
};

export default OrdersByStatus; 