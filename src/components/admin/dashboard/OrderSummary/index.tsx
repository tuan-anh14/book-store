import { Card, Statistic, Space, Typography } from "antd";
import { ArrowUpOutlined } from '@ant-design/icons';
import './styles.scss';

const { Text } = Typography;

const OrderSummary = () => {
    return (
        <Card title="Orders" bordered={false} className="order-summary">
            <Statistic
                value={3270}
                prefix={"$"}
                valueStyle={{ fontSize: 32, fontWeight: 700 }}
            />
            <Space style={{ color: 'rgb(56, 158, 13)', marginTop: 8 }}>
                <ArrowUpOutlined />
                <Text style={{ color: 'rgb(56, 158, 13)', fontWeight: 500, margin: 0 }}>10%</Text>
            </Space>
        </Card>
    );
};

export default OrderSummary; 