import { Card, Rate, Progress, Button, Flex, Typography, Spin } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getCustomerReviewsAPI } from 'services/api';
import './styles.scss';
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const CustomerReviews = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [reviewsData, setReviewsData] = useState<{
        totalReviews: number;
        averageRating: number;
        ratingDistribution: Array<{
            rating: number;
            count: number;
        }>;
    } | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await getCustomerReviewsAPI();
            if (res && res.data) {
                setReviewsData(res.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const getRatingLabel = (rating: number) => {
        switch (rating) {
            case 5: return 'Excellent';
            case 4: return 'Good';
            case 3: return 'Average';
            case 2: return 'Poor';
            case 1: return 'Critical';
            default: return '';
        }
    };

    const getRatingColor = (rating: number) => {
        switch (rating) {
            case 5: return '#7cb305';
            case 4: return '#52c41a';
            case 3: return '#d4b106';
            case 2: return '#fa8c16';
            case 1: return '#cf1322';
            default: return '#000000';
        }
    };

    if (loading) {
        return (
            <Card bordered={false}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Đánh giá khách hàng"
            bordered={false}
            extra={<Button type="text" icon={<QuestionCircleOutlined />} />}
        >
            <Flex vertical gap="middle">
                <Flex align="center" justify="center" gap="middle">
                    <Rate disabled defaultValue={reviewsData?.averageRating || 0} allowHalf />
                    <Text strong style={{ fontSize: 24, margin: 0 }}>
                        {reviewsData?.averageRating.toFixed(1)}/5
                    </Text>
                </Flex>
                <Flex vertical gap="small">
                    {reviewsData?.ratingDistribution.map((item) => {
                        const percentage = (item.count / reviewsData.totalReviews) * 100;
                        return (
                            <Flex key={item.rating} justify="space-between" align="center">
                                <Text>{getRatingLabel(item.rating)}</Text>
                                <Progress
                                    percent={Math.round(percentage)}
                                    showInfo
                                    strokeColor={getRatingColor(item.rating)}
                                    style={{ width: '100%' }}
                                />
                            </Flex>
                        );
                    })}
                </Flex>
            </Flex>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                    type="default"
                    block
                    onClick={() => navigate("/admin/comment")}
                >
                    See all customer reviews
                </Button>
            </div>
        </Card>
    );
};

export default CustomerReviews; 