import { Row, Col, Card } from 'antd';
import MonthlyRevenue from '@/components/admin/dashboard/monthly_revenue';
import OverallSales from '@/components/admin/dashboard/overallsales';
import OrdersByStatus from '@/components/admin/dashboard/orders_by_status';
import CustomerReviews from '@/components/admin/dashboard/customerreviews';
import ExportReport from '@/components/admin/dashboard/ExportReport';
import RealTimeRevenue from '@/components/admin/dashboard/real_time_revenue';
import RevenueTrends from '@/components/admin/dashboard/revenue_trends';
import TopSellingProducts from '@/components/admin/dashboard/top_selling_products';
import SalesPerformance from '@/components/admin/dashboard/sales_performance';

const Dashboard = () => {
    return (
        <div>
            <ExportReport />
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <RealTimeRevenue />
                </Col>
                <Col span={24}>
                    <SalesPerformance />
                </Col>
                <Col span={24}>
                    <RevenueTrends />
                </Col>
                <Col span={24}>
                    <TopSellingProducts />
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Doanh thu theo tháng">
                        <MonthlyRevenue />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Doanh số theo phương thức thanh toán">
                        <OverallSales />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Đơn hàng theo trạng thái">
                        <OrdersByStatus />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Đánh giá khách hàng">
                        <CustomerReviews />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard; 