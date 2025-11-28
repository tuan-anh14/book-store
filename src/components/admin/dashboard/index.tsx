import React from 'react';
import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import CustomerReviews from './CustomerReviews';
import OrderSummary from './order_summary';
import OverallSales from './OverallSales';
import OrdersByStatus from './orders_by_status';
import './styles.scss';
import MonthlyRevenue from "./monthly_revenue";
import ExportReport from "./ExportReport";
import RealTimeRevenue from './real_time_revenue';
import RevenueTrends from './revenue_trends';
import TopSellingProducts from './top_selling_products';
import SalesPerformance from './sales_performance';

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
                <Col span={6}>
                    <OrderSummary />
                </Col>
            </Row>

            {/* Doanh thu thời gian thực */}
            <Row gutter={[16, 16]} className="dashboard__row">
                <Col span={24}>
                    <RealTimeRevenue />
                </Col>
            </Row>

            {/* Hiệu suất bán hàng */}
            <Row gutter={[16, 16]} className="dashboard__row">
                <Col span={24}>
                    <SalesPerformance />
                </Col>
            </Row>

            {/* Xu hướng doanh thu */}
            <Row gutter={[16, 16]} className="dashboard__row">
                <Col span={24}>
                    <RevenueTrends />
                </Col>
            </Row>

            {/* Sản phẩm bán chạy nhất */}
            <Row gutter={[16, 16]} className="dashboard__row">
                <Col span={24}>
                    <TopSellingProducts />
                </Col>
            </Row>

            <Row gutter={[40, 40]} className="dashboard__row">
                <Col span={12}>
                    <OverallSales />
                </Col>
                <Col span={12}>
                    <OrdersByStatus />
                </Col>
            </Row>

            <Row gutter={[40, 40]} className="dashboard__row">
                <Col span={12}>
                    <MonthlyRevenue />
                </Col>
                <Col span={12}>
                    <CustomerReviews />
                </Col>
            </Row>

            <Row gutter={[40, 40]} className="dashboard__row">
                <Col span={12}>
                    <ExportReport />
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;