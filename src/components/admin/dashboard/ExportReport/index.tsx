import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { getMonthlyRevenueAPI, getOverallSalesAPI, getOrdersByStatusAPI, getCustomerReviewsAPI } from 'services/api';
import { useState } from 'react';

interface MonthlyRevenueItem {
    month: string;
    revenue: number;
}

interface SalesItem {
    type: string;
    count: number;
    totalAmount: number;
}

interface OrderStatusItem {
    status: string;
    count: number;
}

interface ReviewItem {
    rating: number;
    count: number;
}

interface CustomerReviewsData {
    ratingDistribution: ReviewItem[];
    totalReviews: number;
    averageRating: number;
}

const ExportReport = () => {
    const [exportData, setExportData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handlePrepareExport = async () => {
        try {
            setIsLoading(true);
            // Lấy dữ liệu từ các API
            const [monthlyRevenue, overallSales, ordersByStatus, customerReviews] = await Promise.all([
                getMonthlyRevenueAPI(),
                getOverallSalesAPI(),
                getOrdersByStatusAPI(),
                getCustomerReviewsAPI()
            ]);

            if (!monthlyRevenue?.data || !overallSales?.data || !ordersByStatus?.data || !customerReviews?.data) {
                throw new Error('Không thể lấy dữ liệu từ API');
            }

            const customerReviewsData = customerReviews.data as CustomerReviewsData;

            // Chuẩn bị dữ liệu cho export
            const data = [
                // Header
                ['BÁO CÁO THỐNG KÊ'],
                ['Ngày xuất:', new Date().toLocaleDateString()],
                [],
                // Doanh thu theo tháng
                ['DOANH THU THEO THÁNG'],
                ['Tháng', 'Doanh thu (VNĐ)'],
                ...monthlyRevenue.data.map((item: MonthlyRevenueItem) => [
                    item.month,
                    item.revenue.toLocaleString()
                ]),
                [],
                // Doanh số theo phương thức
                ['DOANH SỐ THEO PHƯƠNG THỨC THANH TOÁN'],
                ['Phương thức', 'Số lượng đơn hàng', 'Tổng doanh thu (VNĐ)'],
                ...overallSales.data.map((item: SalesItem) => [
                    item.type,
                    item.count,
                    item.totalAmount.toLocaleString()
                ]),
                [],
                // Đơn hàng theo trạng thái
                ['ĐƠN HÀNG THEO TRẠNG THÁI'],
                ['Trạng thái', 'Số lượng'],
                ...ordersByStatus.data.map((item: OrderStatusItem) => [
                    item.status,
                    item.count
                ]),
                [],
                // Đánh giá khách hàng
                ['ĐÁNH GIÁ KHÁCH HÀNG'],
                ['Số sao', 'Số lượng đánh giá'],
                ...customerReviewsData.ratingDistribution.map((item: ReviewItem) => [
                    item.rating,
                    item.count
                ]),
                [],
                // Tổng quan
                ['TỔNG QUAN'],
                ['Chỉ số', 'Giá trị'],
                ['Tổng số đánh giá', customerReviewsData.totalReviews],
                ['Đánh giá trung bình', customerReviewsData.averageRating.toFixed(1) + ' sao']
            ];

            setExportData(data);
            message.success('Đã chuẩn bị dữ liệu xuất báo cáo!');
        } catch (error) {
            console.error('Error preparing export:', error);
            message.error('Có lỗi xảy ra khi chuẩn bị dữ liệu xuất báo cáo!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handlePrepareExport}
                loading={isLoading}
                style={{ marginRight: 8 }}
            >
                Chuẩn bị xuất báo cáo
            </Button>
            {exportData.length > 0 && (
                <CSVLink
                    data={exportData}
                    filename={`BaoCaoThongKe_${new Date().toISOString().split('T')[0]}.csv`}
                    className="ant-btn ant-btn-primary"
                >
                    Xuất báo cáo
                </CSVLink>
            )}
        </div>
    );
};

export default ExportReport; 