import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import {
    getMonthlyRevenueAPI,
    getOverallSalesAPI,
    getOrdersByStatusAPI,
    getCustomerReviewsAPI
} from 'services/api';
import { useState } from 'react';

const ExportReport = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Tiện ích tạo style bảng
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
            const [monthlyRevenue, overallSales, ordersByStatus, customerReviews] = await Promise.all([
                getMonthlyRevenueAPI(),
                getOverallSalesAPI(),
                getOrdersByStatusAPI(),
                getCustomerReviewsAPI()
            ]);

            if (!monthlyRevenue?.data || !overallSales?.data || !ordersByStatus?.data || !customerReviews?.data) {
                throw new Error('Dữ liệu API không hợp lệ');
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo cáo thống kê');

            // Tiêu đề chính
            worksheet.mergeCells('A1', 'D1');
            worksheet.getCell('A1').value = 'BÁO CÁO THỐNG KÊ';
            worksheet.getCell('A1').style = {
                font: { bold: true, size: 18, color: { argb: 'FFFFFF' } },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '22C55E' } }
            };
            worksheet.getRow(1).height = 25;

            worksheet.addRow([]);
            worksheet.addRow(['Ngày xuất', new Date().toLocaleDateString()]);
            worksheet.addRow([]);

            // --- Doanh thu theo tháng ---
            worksheet.addRow(['DOANH THU THEO THÁNG']);
            const header1 = worksheet.addRow(['Tháng', 'Doanh thu (VNĐ)']);
            styleRowCells(header1, { fillColor: '22C55E', bold: true });
            monthlyRevenue.data.forEach((item: any) => {
                const r = worksheet.addRow([item.month, item.revenue]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Doanh số theo phương thức thanh toán ---
            worksheet.addRow(['DOANH SỐ THEO PHƯƠNG THỨC THANH TOÁN']);
            const header2 = worksheet.addRow(['Phương thức', 'Số lượng đơn hàng', 'Tổng doanh thu (VNĐ)']);
            styleRowCells(header2, { fillColor: '22C55E', bold: true });
            overallSales.data.forEach((item: any) => {
                const r = worksheet.addRow([item.type, item.count, item.totalAmount]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Đơn hàng theo trạng thái ---
            worksheet.addRow(['ĐƠN HÀNG THEO TRẠNG THÁI']);
            const header3 = worksheet.addRow(['Trạng thái', 'Số lượng']);
            styleRowCells(header3, { fillColor: '22C55E', bold: true });
            ordersByStatus.data.forEach((item: any) => {
                const r = worksheet.addRow([item.status, item.count]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Đánh giá khách hàng ---
            worksheet.addRow(['ĐÁNH GIÁ KHÁCH HÀNG']);
            const header4 = worksheet.addRow(['Số sao', 'Số lượng đánh giá']);
            styleRowCells(header4, { fillColor: '22C55E', bold: true });
            customerReviews.data.ratingDistribution.forEach((item: any) => {
                const r = worksheet.addRow([item.rating, item.count]);
                styleRowCells(r);
            });
            worksheet.addRow([]);

            // --- Tổng quan ---
            worksheet.addRow(['TỔNG QUAN']);
            const header5 = worksheet.addRow(['Chỉ số', 'Giá trị']);
            styleRowCells(header5, { fillColor: '22C55E', bold: true });
            const totalReviewsRow = worksheet.addRow(['Tổng số đánh giá', customerReviews.data.totalReviews]);
            const avgRatingRow = worksheet.addRow(['Đánh giá trung bình', `${customerReviews.data.averageRating.toFixed(1)} sao`]);
            styleRowCells(totalReviewsRow);
            styleRowCells(avgRatingRow);

            // Căn chỉnh độ rộng cột tự động
            (worksheet.columns as ExcelJS.Column[]).forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const value = cell.value ? cell.value.toString() : '';
                    maxLength = Math.max(maxLength, value.length);
                });
                column.width = maxLength + 5;
            });

            // Lưu file
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `BaoCaoThongKe_${new Date().toISOString().split('T')[0]}.xlsx`);
            message.success('Đã xuất báo cáo Excel!');
        } catch (error) {
            console.error('Export error:', error);
            message.error('Có lỗi khi xuất file Excel!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportExcel}
                loading={isLoading}
            >
                Xuất báo cáo Excel
            </Button>
        </div>
    );
};

export default ExportReport;
