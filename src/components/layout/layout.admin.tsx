import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FolderOutlined,
    CommentOutlined,
    LogoutOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, Result, Button } from 'antd';
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/services/helper';
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import { logoutAPI } from '@/services/api';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;


const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useCurrentApp();


    const handleLogout = async () => {
        const res = await logoutAPI()
        if (res.data) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token")
        }

    }

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage Users</span>,
            key: 'user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: 'crud',
                    icon: <TeamOutlined />,
                },
                // {
                //     label: 'Files1',
                //     key: 'file1',
                //     icon: <TeamOutlined />,
                // }
            ]
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: 'book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/category'>Manage Categories</Link>,
            key: 'category',
            icon: <FolderOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: 'order',
            icon: <DollarCircleOutlined />
        },
        {
            label: <Link to='/admin/comment'>Manage Comments</Link>,
            key: 'comment',
            icon: <CommentOutlined />
        },
        {
            label: <Link to='/admin/request'>Manage Complaints</Link>,
            key: 'request',
            icon: <ExceptionOutlined />
        },
    ];

    const itemsDropdown = [
        {
            label: <Link to={'/'}><HomeOutlined /> Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            ><LogoutOutlined /> Đăng xuất</label>,
            key: 'logout',
        },

    ];

    const urlAvatar = getImageUrl(user?.avatar, 'avatar');

    if (isAuthenticated == false) {
        return (
            <Outlet></Outlet>
        )
    }

    const isAdminRoute = location.pathname.includes("admin")
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === 'USER') {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary">
                        <Link to="/">Back home</Link>
                    </Button>}
                />
            )
        }
    }

    return (
        <>
            <Layout
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header'>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={urlAvatar} />
                                {user?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content className='admin-content'>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        {/* Tuan Anh &copy; Tuan Anh <HeartTwoTone /> */}
                    </Footer>
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;