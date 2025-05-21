import { Card, Rate, Progress, Button, Flex, Typography } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import './styles.scss';

const { Text } = Typography;

const CustomerReviews = () => {
    return (
        <Card
            title="Customer reviews"
            bordered={false}
            extra={<Button type="text" icon={<QuestionCircleOutlined />} />}
        >
            <Flex vertical gap="middle">
                <Flex align="center" justify="center" gap="middle">
                    <Rate disabled defaultValue={4.5} allowHalf />
                    <Text strong style={{ fontSize: 24, margin: 0 }}>4.6/5</Text>
                </Flex>
                <Flex vertical gap="small">
                    <Flex justify="space-between" align="center">
                        <Text>Excellent</Text>
                        <Progress
                            percent={35}
                            showInfo
                            strokeColor="#7cb305"
                            style={{ width: 300 }}
                        />
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text>Good</Text>
                        <Progress
                            percent={25}
                            showInfo
                            strokeColor="#52c41a"
                            style={{ width: 300 }}
                        />
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text>Average</Text>
                        <Progress
                            percent={30}
                            showInfo
                            strokeColor="#d4b106"
                            style={{ width: 300 }}
                        />
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text>Poor</Text>
                        <Progress
                            percent={30}
                            showInfo
                            strokeColor="#fa8c16"
                            style={{ width: 300 }}
                        />
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text>Critical</Text>
                        <Progress
                            percent={30}
                            showInfo
                            strokeColor="#cf1322"
                            style={{ width: 300 }}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button type="default" block>See all customer reviews</Button>
            </div>
        </Card>
    );
};

export default CustomerReviews; 