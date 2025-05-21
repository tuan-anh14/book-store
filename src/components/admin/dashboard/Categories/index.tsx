import { Card, Button, Flex, Typography, Space } from "antd";
import { QuestionCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './styles.scss';

const COLORS = ['#5D7092', '#5AD8A6', '#5B8FF9', '#F6BD16', '#E8684A'];

const data = [
    { name: 'Clothing', value: 18 },
    { name: 'Electronics', value: 15 },
    { name: 'Books', value: 12 },
    { name: 'Food', value: 10 },
    { name: 'Others', value: 8 },
];

const Categories = () => {
    return (
        <Card
            title="Categories"
            bordered={false}
            extra={<Button type="text" icon={<QuestionCircleOutlined />} />}
            className="categories"
        >
            <div className="categories__chart">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default Categories; 