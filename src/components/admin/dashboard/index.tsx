import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import CustomerReviews from './CustomerReviews';
import Categories from './Categories';
import OrderSummary from './OrderSummary';
import OverallSales from './OverallSales';
import OrdersByStatus from './OrdersByStatus';
import './styles.scss';

const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0,
    });

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardAPI();
            if (res && res.data) setDataDashboard(res.data);
        };
        initDashboard();
    }, []);

    const formatter = (value: any) => <CountUp end={value} separator="," />;

    return (
        <div className="dashboard">
            <Row gutter={[40, 40]} className="dashboard__row">
                <Col span={6}>
                    <Card title="Tổng Users" bordered={false} className="dashboard__card">
                        <Statistic
                            title="Tổng Users"
                            value={dataDashboard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <OrderSummary />
                </Col>
                <Col span={6}>
                    <Card title="Tổng Đơn hàng" bordered={false} className="dashboard__card">
                        <Statistic
                            title="Tổng Đơn hàng"
                            value={dataDashboard.countOrder}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Tổng Books" bordered={false} className="dashboard__card">
                        <Statistic
                            title="Tổng Books"
                            value={dataDashboard.countBook}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[40, 40]}>
                <Col span={12}>
                    <OverallSales />
                </Col>
                <Col span={12}>
                    <OrdersByStatus />
                </Col>
            </Row>
            <Row gutter={[40, 40]}>
                <Col span={12}>
                    <CustomerReviews />
                </Col>
                <Col span={12}>
                    <Categories />
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;