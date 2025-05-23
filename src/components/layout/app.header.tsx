import { useState } from 'react';
import { Divider, Drawer, Avatar, Popover, Empty, message, Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';
import {
    EnvironmentOutlined,
    UserOutlined,
    HistoryOutlined,
    LogoutOutlined,
    SettingOutlined,
    HomeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import SearchResults from '../client/search/search.result';
import logoBook from '@/assets/logo_book.jpg';

const AppHeader = (props: any) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { isAuthenticated, user, setUser, setIsAuthenticated, carts } = useCurrentApp();

    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutAPI()
        if (res.data) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token")
            message.success("Đăng xuất thành công.");
            navigate("/");
        }
    }

    let items = [
        {
            label: (
                <label
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setOpenManageAccount(true)}
                >
                    <UserOutlined />
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: (
                <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HistoryOutlined />
                    Lịch sử mua hàng
                </Link>
            ),
            key: 'history',
        },
        {
            label: (
                <label
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => handleLogout()}
                >
                    <LogoutOutlined />
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: (
                <Link to='/admin' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SettingOutlined />
                    Trang quản trị
                </Link>
            ),
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                    :
                    <Empty
                        description="Không có sản phẩm trong giỏ hàng"
                    />
                }
            </div>
        )
    }

    return (
        <div className='header-container tiki-header'>
            <header className="page-header">
                <div className="header-main">
                    {/* Logo + slogan */}
                    <div className="header-logo-block">
                        <Link to="/" className="tiki-logo">
                            <img src={logoBook} alt="book-logo" style={{ width: 120, height: 'auto', objectFit: 'contain' }} />
                        </Link>
                    </div>
                    {/* Search */}
                    <div className="header-search-block">
                        <div className="search-box">
                            <img className="icon-search" src="https://salt.tikicdn.com/ts/upload/33/d0/37/6fef2e788f00a16dc7d5a1dfc5d0e97a.png" alt="icon-search" />
                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="Tìm kiếm sách..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchResults(true);
                                }}
                                onFocus={() => setShowSearchResults(true)}
                            />
                            <button className="search-btn">Tìm kiếm</button>
                        </div>
                        {showSearchResults && (
                            <SearchResults
                                searchQuery={searchQuery}
                                onClose={() => setShowSearchResults(false)}
                            />
                        )}
                    </div>
                    {/* Shortcut + Giao đến */}
                    <div className="header-right-block">
                        <div className="header-shortcut-block">
                            <div className="shortcut-item" onClick={() => navigate('/')}>
                                <HomeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                <span>Trang chủ</span>
                            </div>
                            <div className="shortcut-item">
                                <Popover
                                    className="popover-carts"
                                    placement="bottomRight"
                                    rootClassName="popover-carts"
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}>
                                    <div style={{ position: 'relative' }}>
                                        <ShoppingCartOutlined
                                            style={{ fontSize: '20px', color: '#1890ff' }}
                                            className="cart-icon"
                                        />
                                        <span className="cart-count">{carts?.length ?? 0}</span>
                                    </div>
                                </Popover>
                            </div>
                            <div className="shortcut-item">
                                {!isAuthenticated ?
                                    <div className="account-shortcut" onClick={() => navigate('/login')}>
                                        <UserOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                        <span>Tài khoản</span>
                                    </div>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space className="account-shortcut" style={{ cursor: 'pointer' }}>
                                            <Avatar src={urlAvatar} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </div>
                        </div>
                        <div className="header-delivery-zone">
                            <EnvironmentOutlined style={{ color: '#1890ff', fontSize: 20, marginRight: 6 }} />
                            <span className="delivery-label">Giao đến:</span>
                            <span className="delivery-address">
                                {/* {user?.address ? <b>{user.address}</b> : <span style={{ color: '#888' }}>Chưa xác định</span>} */}
                                <span style={{ color: '#888' }}>Chưa xác định</span>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Dải link nhanh */}
                <div className="header-quicklinks">
                    <a href="#">điện gia dụng</a>
                    <a href="#">xe cộ</a>
                    <a href="#">mẹ & bé</a>
                    <a href="#">khỏe đẹp</a>
                    <a href="#">nhà cửa</a>
                    <a href="#">sách</a>
                    <a href="#">thể thao</a>
                    <a href="#">định giá cổ phiếu</a>
                    <a href="#">sách kinh tế</a>
                    <a href="#">tâm lý học về tiền</a>
                </div>
            </header>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                    <UserOutlined />
                    <span>Quản lý tài khoản</span>
                </div>
                <Divider />

                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', cursor: 'pointer' }}
                    onClick={() => handleLogout()}
                >
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </div>
                <Divider />
            </Drawer>

            <ManageAccount
                isModalOpen={openManageAccount}
                setIsModalOpen={setOpenManageAccount}
            />

        </div>
    )
};

export default AppHeader;