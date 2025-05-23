import { Row, Col, Card } from 'antd';
import MonthlyRevenue from '@/components/admin/dashboard/monthly_revenue';
import OverallSales from '@/components/admin/dashboard/overallsales';
import OrdersByStatus from '@/components/admin/dashboard/orders_by_status';
import CustomerReviews from '@/components/admin/dashboard/customerreviews';
import ExportReport from '@/components/admin/dashboard/ExportReport';

const Dashboard = () => {
    return (
        <div>
            <ExportReport />
            <Row gutter={[16, 16]}>
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