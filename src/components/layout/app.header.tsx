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
    ShoppingCartOutlined,
    QuestionCircleOutlined
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
                <Link to="/support" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <QuestionCircleOutlined />
                    Trung tâm hỗ trợ
                </Link>
            ),
            key: 'support',
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

    console.log(user)

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
                                {user?.address ? <b>{user.address}</b> : <span style={{ color: '#888' }}>Chưa xác định</span>}
                                {/* <span style={{ color: '#888' }}>Chưa xác định</span> */}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Cam kết */}
                <div style={{ backgroundColor: 'white' }} className="commitment-section">
                    <div className="commitment-link">
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ color: '#003EA1' }} className="commitment-title">Cam kết</div>
                            <div style={{ display: 'flex', gap: '4px', paddingInline: '6px', alignItems: 'center' }}>
                                <img src="https://salt.tikicdn.com/ts/upload/96/76/a3/16324a16c76ee4f507d5777608dab831.png" alt="icon-0" width="20" height="20" />
                                <div style={{ color: '#27272A', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>100% hàng thật</div>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#EBEBF0' }}></div>
                            <div style={{ display: 'flex', gap: '4px', paddingInline: '6px', alignItems: 'center' }}>
                                <img src="https://salt.tikicdn.com/ts/upload/11/09/ec/456a2a8c308c2de089a34bbfef1c757b.png" alt="icon-1" width="20" height="20" />
                                <div style={{ color: '#27272A', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>Freeship mọi đơn</div>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#EBEBF0' }}></div>
                            <div style={{ display: 'flex', gap: '4px', paddingInline: '6px', alignItems: 'center' }}>
                                <img src="https://salt.tikicdn.com/ts/upload/0b/f2/19/c03ae8f46956eca66845fb9aaadeca1e.png" alt="icon-2" width="20" height="20" />
                                <div style={{ color: '#27272A', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>Hoàn 200% nếu hàng giả</div>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#EBEBF0' }}></div>
                            <div style={{ display: 'flex', gap: '4px', paddingInline: '6px', alignItems: 'center' }}>
                                <img src="https://salt.tikicdn.com/ts/upload/3a/f4/7d/86ca29927e9b360dcec43dccb85d2061.png" alt="icon-3" width="20" height="20" />
                                <div style={{ color: '#27272A', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>30 ngày đổi trả</div>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#EBEBF0' }}></div>
                            <div style={{ display: 'flex', gap: '4px', paddingInline: '6px', alignItems: 'center' }}>
                                <img src="https://salt.tikicdn.com/ts/upload/87/98/77/fc33e3d472fc4ce4bae8c835784b707a.png" alt="icon-4" width="20" height="20" />
                                <div style={{ color: '#27272A', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>Giao nhanh 2h</div>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#EBEBF0' }}></div>
                            <div style={{ display: 'flex', gap: '4px', paddingInline: '6px', alignItems: 'center' }}>
                                <img src="https://salt.tikicdn.com/ts/upload/6a/81/06/0675ef5512c275a594d5ec1d58c37861.png" alt="icon-5" width="20" height="20" />
                                <div style={{ color: '#27272A', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>Giá siêu rẻ</div>
                            </div>
                        </div>
                    </div>
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