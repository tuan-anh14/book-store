import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import {
    getMonthlyRevenueAPI,
    getOverallSalesAPI,
    getOrdersByStatusAPI,
    getCustomerReviewsAPI,
    getRealTimeRevenueAPI,
    getRevenueTrendsAPI,
    getSalesPerformanceAPI,
    getTopSellingProductsAPI
} from '@/services/api';

const ExportReport: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const styleRowCells = (row: ExcelJS.Row, options?: { fillColor?: string; bold?: boolean }) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            if (options?.fillColor) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: options.fillColor }
                };
            }
            if (options?.bold) {
                cell.font = { bold: true };
            }
        });
        row.height = 20;
    };

    const handleExportExcel = async () => {
        setIsLoading(true);
        try {
            const [
                monthlyRevenue,
                overallSales,
                ordersByStatus,
                customerReviews,
                realtime,
                trends,
                performance,
                products
            ] = await Promise.all([
                getMonthlyRevenueAPI(),
                getOverallSalesAPI(),
                getOrdersByStatusAPI(),
                getCustomerReviewsAPI(),
                getRealTimeRevenueAPI(),
                getRevenueTrendsAPI('day'),
                getSalesPerformanceAPI(),
                getTopSellingProductsAPI('day')
            ]);

            if (!monthlyRevenue?.data || !overallSales?.data || !ordersByStatus?.data || !customerReviews?.data) {
                throw new Error('Dữ liệu API cũ không hợp lệ');
            }
            if (!realtime?.data || !trends?.data || !performance?.data || !products?.data) {
                console.warn('Dữ liệu API phân tích mới có thể thiếu.');
            }

            // Create workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo cáo tổng hợp');

            // --- Báo cáo cũ ---

            // --- Doanh thu theo tháng ---
            worksheet.addRow(['DOANH THU THEO THÁNG']);
            const header1 = worksheet.addRow(['Tháng', 'Doanh thu (VNĐ)']);
            styleRowCells(header1, { fillColor: '22C55E', bold: true });
            monthlyRevenue.data.forEach((item: any) => {
                const r = worksheet.addRow([item.month, (item.revenue || 0).toLocaleString()]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Doanh số theo phương thức thanh toán ---
            worksheet.addRow(['DOANH SỐ THEO PHƯƠNG THỨC THANH TOÁN']);
            const header2 = worksheet.addRow(['Phương thức', 'Số lượng đơn hàng', 'Tổng doanh thu (VNĐ)']);
            styleRowCells(header2, { fillColor: '22C55E', bold: true });
            overallSales.data.forEach((item: any) => {
                const r = worksheet.addRow([item.type, item.count || 0, (item.totalAmount || 0).toLocaleString()]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Đơn hàng theo trạng thái ---
            worksheet.addRow(['ĐƠN HÀNG THEO TRẠNG THÁI']);
            const header3 = worksheet.addRow(['Trạng thái', 'Số lượng']);
            styleRowCells(header3, { fillColor: '22C55E', bold: true });
            ordersByStatus.data.forEach((item: any) => {
                const r = worksheet.addRow([item.status, item.count || 0]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Đánh giá khách hàng ---
            worksheet.addRow(['ĐÁNH GIÁ KHÁCH HÀNG']);
            const header4 = worksheet.addRow(['Số sao', 'Số lượng đánh giá']);
            styleRowCells(header4, { fillColor: '22C55E', bold: true });
            customerReviews.data.ratingDistribution.forEach((item: any) => {
                const r = worksheet.addRow([item.rating || 'N/A', item.count || 0]);
                styleRowCells(r);
            });
            // Thêm dòng tổng và trung bình nếu có dữ liệu
            if (customerReviews.data.totalReviews !== undefined) {
                const totalReviewsRow = worksheet.addRow(['Tổng số đánh giá', customerReviews.data.totalReviews]);
                styleRowCells(totalReviewsRow);
            }
            if (customerReviews.data.averageRating !== undefined) {
                const avgRatingRow = worksheet.addRow(['Đánh giá trung bình', `${(customerReviews.data.averageRating || 0).toFixed(1)} sao`]);
                styleRowCells(avgRatingRow);
            }

            worksheet.addRow([]); // Dòng trống ngăn cách các phần


            // --- Báo cáo mới từ API phân tích ---

            // --- Xu hướng doanh thu ---
            //@ts-ignore
            if (trends?.data?.length > 0) {
                worksheet.addRow(['XU HƯỚNG DOANH THU (Theo ngày)']); // Ghi rõ theo ngày hoặc có thể làm động
                const headerTrends = worksheet.addRow(['Thời gian', 'Doanh thu (VNĐ)', 'Số đơn hàng', 'Giá trị đơn trung bình']);
                styleRowCells(headerTrends, { fillColor: 'FF9900', bold: true });
                trends.data?.forEach((item: any) => {
                    const timeLabel = item.timeLabel || (item.time?.hour !== undefined ? `Giờ ${item.time.hour}` : (item.time?.day !== undefined ? `Ngày ${item.time.day}` : 'N/A'));
                    const r = worksheet.addRow([
                        timeLabel,
                        (item?.revenue || 0).toLocaleString(),
                        item?.orderCount || 0,
                        (item?.averageOrderValue || 0).toLocaleString()
                    ]);
                    styleRowCells(r);
                });
                worksheet.addRow([]);
            }

            // --- Hiệu suất bán hàng ---
            // Cần xem lại cấu trúc data của SalesPerformanceAPI để xử lý
            // Dựa vào API definition: Array<{ daily: [], weekly: [], monthly: [] }>
            // Giả định data[0] chứa cả daily, weekly, monthly
            if (performance?.data?.[0]) {
                const perfData = performance.data[0];
                worksheet.addRow(['HIỆU SUẤT BÁN HÀNG']);
                const headerPerf = worksheet.addRow(['Kỳ', 'Doanh thu (VNĐ)', 'Số đơn hàng']);
                styleRowCells(headerPerf, { fillColor: 'FF9900', bold: true });

                if (perfData.daily?.length > 0) {
                    const r = worksheet.addRow(['Ngày', (perfData.daily[0].revenue || 0).toLocaleString(), perfData.daily[0].orderCount || 0]);
                    styleRowCells(r);
                }
                if (perfData.weekly?.length > 0) {
                    const r = worksheet.addRow(['Tuần', (perfData.weekly[0].revenue || 0).toLocaleString(), perfData.weekly[0].orderCount || 0]);
                    styleRowCells(r);
                }
                if (perfData.monthly?.length > 0) {
                    const r = worksheet.addRow(['Tháng', (perfData.monthly[0].revenue || 0).toLocaleString(), perfData.monthly[0].orderCount || 0]);
                    styleRowCells(r);
                }
                worksheet.addRow([]);
            }


            // --- Sản phẩm bán chạy nhất ---
            //@ts-ignore
            if (products?.data?.length > 0) {
                worksheet.addRow(['SẢN PHẨM BÁN CHẠY NHẤT (Theo ngày)']); // Ghi rõ theo ngày hoặc có thể làm động
                const headerProducts = worksheet.addRow(['Tên sách', 'Số lượng bán', 'Tổng doanh thu (VNĐ)']);
                styleRowCells(headerProducts, { fillColor: 'FF9900', bold: true });
                products.data?.forEach((item: any) => {
                    const r = worksheet.addRow([
                        item?.bookName || 'N/A',
                        item?.totalQuantity || 0,
                        (item?.totalRevenue || 0).toLocaleString()
                    ]);
                    styleRowCells(r);
                });
                worksheet.addRow([]);
            }


            // Căn chỉnh độ rộng cột tự động (có thể cần điều chỉnh lại sau khi thêm dữ liệu mới)
            (worksheet.columns as ExcelJS.Column[]).forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const value = cell.value ? cell.value.toString() : '';
                    maxLength = Math.max(maxLength, value.length);
                });
                // Đặt độ rộng tối thiểu để tránh cột quá hẹp
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });

            // Lưu file
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `BaoCaoThongKe_${new Date().toISOString().split('T')[0]}.xlsx`);
            message.success('Đã xuất báo cáo Excel!');
        } catch (error: any) { // Bắt lỗi cụ thể hơn
            console.error('Export error:', error);
            message.error(`Có lỗi khi xuất file Excel: ${error.message || 'Lỗi không xác định'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="Xuất báo cáo tổng hợp">
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportExcel}
                loading={isLoading}
            >
                Xuất báo cáo Excel
            </Button>
        </Card>
    );
};

export default ExportReport;
