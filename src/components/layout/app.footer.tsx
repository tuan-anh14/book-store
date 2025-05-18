import React from 'react';
import './app.footer.scss';

const AppFooter = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-block">
                    <h4>Hỗ trợ khách hàng</h4>
                    <p className="hotline">Hotline: <a href="tel:1900-6035">1900-6035</a><span className="small-text">(1000 đ/phút, 8-21h kể cả T7, CN)</span></p>
                    <a href="#" className="small-text">Các câu hỏi thường gặp</a>
                    <a href="#" className="small-text">Gửi yêu cầu hỗ trợ</a>
                    <a href="#" className="small-text">Hướng dẫn đặt hàng</a>
                    <a href="#" className="small-text">Phương thức vận chuyển</a>
                    <a href="#" className="small-text">Chính sách kiểm hàng</a>
                    <a href="#" className="small-text">Chính sách đổi trả</a>
                    <a href="#" className="small-text">Hướng dẫn trả góp</a>
                    <a href="#" className="small-text">Chính sách hàng nhập khẩu</a>
                    <p className="security">Hỗ trợ khách hàng: <a href="mailto:hotro@bookstore.vn">hotro@bookstore.vn</a></p>
                    <p className="security">Báo lỗi bảo mật: <a href="mailto:security@bookstore.vn">security@bookstore.vn</a></p>
                </div>
                <div className="footer-block">
                    <h4>Về BookStore</h4>
                    <a href="#" className="small-text">Giới thiệu BookStore</a>
                    <a href="#" className="small-text">Blog</a>
                    <a href="#" className="small-text">Tuyển dụng</a>
                    <a href="#" className="small-text">Chính sách bảo mật thanh toán</a>
                    <a href="#" className="small-text">Chính sách bảo mật thông tin cá nhân</a>
                    <a href="#" className="small-text">Chính sách giải quyết khiếu nại</a>
                    <a href="#" className="small-text">Điều khoản sử dụng</a>
                    <a href="#" className="small-text">Giới thiệu Book Xu</a>
                    <a href="#" className="small-text">Tiếp thị liên kết cùng BookStore</a>
                    <a href="#" className="small-text">Bán hàng doanh nghiệp</a>
                    <a href="#" className="small-text">Điều kiện vận chuyển</a>
                </div>
                <div className="footer-block">
                    <h4>Hợp tác và liên kết</h4>
                    <a href="#" className="small-text">Quy chế hoạt động Sàn TMĐT</a>
                    <a href="#" className="small-text">Bán hàng cùng BookStore</a>
                    <h4 style={{ marginTop: 24 }}>Chứng nhận bởi</h4>
                    <div className="certs">
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png" width={32} height={32} alt="bo-cong-thuong-2" />
                        <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg" width={83} height={32} alt="bo-cong-thuong" />
                        <img src="https://images.dmca.com/Badges/dmca_protected_sml_120y.png?ID=388d758c-6722-4245-a2b0-1d2415e70127" width={32} height={32} alt="dmca" />
                    </div>
                </div>
                <div className="footer-block payment-block">
                    <h4>Phương thức thanh toán</h4>
                    <div className="payment-icons">
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg" alt="visa" height={32} />
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg" alt="mastercard" height={32} />
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jcb.svg" alt="jcb" height={32} />
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg" alt="paypal" height={32} />
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/applepay.svg" alt="applepay" height={32} />
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlepay.svg" alt="googlepay" height={32} />
                    </div>
                    <h4>Kết nối với chúng tôi</h4>
                    <div className="social-icons">
                        <a href="#" title="Facebook"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" width={32} alt="facebook" /></a>
                        <a href="#" title="Youtube"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" width={32} alt="youtube" /></a>
                        <a href="#" title="Zalo"><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" width={32} alt="zalo" /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">© 2025 BookStore. All rights reserved.</div>
        </footer>
    );
};

export default AppFooter; 