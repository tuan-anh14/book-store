import MobileFilter from '@/components/client/book/mobile.filter';
import { getBooksAPI, getCategoryAPI, getCommentsByBookAPI } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '@/components/popup/popup';
import popupImg from '@/assets/popup.jpg';
import { getImageUrl } from '@/services/helper';

import 'styles/home.scss';

type FieldType = {
    range: {
        from: number;
        to: number;
    };
    category: string[];
};

const HomePage = () => {
    const navigate = useNavigate();
    const [listCategory, setListCategory] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState(false);

    const [form] = Form.useForm();

    const [starFilter, setStarFilter] = useState<number | null>(null);
    const [bookComments, setBookComments] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const initCategory = async () => {
            try {
                const res = await getCategoryAPI();
                if (res?.data) {
                    const d = res.data.map((item) => {
                        return {
                            label: item.name,  // Sử dụng thuộc tính name
                            value: item.name   // Sử dụng thuộc tính _id
                        };
                    });
                    setListCategory(d);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    useEffect(() => {
        const count = Number(localStorage.getItem('popupHomeCount') || '0');
        // if (count < 10) {
        setShowPopup(true);
        localStorage.setItem('popupHomeCount', String(count + 1));
        // }
    }, []);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}&populate=comments`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnchangePage = (pagination: { current: number; pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log(">>> check handleChangeFilter", changedValues, values);
        //only fire if category changes
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`);
            } else {
                //reset data -> fetch all
                setFilter('');
            }
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        let f = '';
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            // Loại bỏ dấu $ ở đây
            f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category.join(',');
                f += `&category=${cate}`;
            }
        } else if (values?.category?.length) {
            const cate = values?.category.join(',');
            f = `category=${cate}`;
        }
        setFilter(f);
    };
    const onChange = (key: string) => {
        console.log(key);
    };

    const items = [
        {
            key: 'sort=-sold',
            label: 'Phổ biến',
            children: <></>,
        },
        {
            key: 'sort=-updateAt',
            label: 'Hàng Mới',
            children: <></>,
        },
        {
            key: 'sort=price',
            label: 'Giá Từ Thấp Đến Cao',
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: 'Giá Từ Cao Đến Thấp',
            children: <></>,
        },
    ];

    // Lọc sách theo số sao nếu có chọn bộ lọc
    const filteredBooks = starFilter
        ? listBook.filter(item => {
            const comments = bookComments[item._id] || [];
            const avgRating = comments.length > 0
                ? (comments.reduce((sum, c) => sum + (c.star || 0), 0) / comments.length)
                : 0;
            return Math.round(avgRating) >= starFilter;
        })
        : listBook;

    const fetchCommentsForBook = async (bookId: string) => {
        try {
            const res = await getCommentsByBookAPI(bookId);
            if (res?.data) {
                setBookComments(prev => ({
                    ...prev,
                    [bookId]: res.data
                }));
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        // Fetch comments for each book when listBook changes
        if (listBook.length > 0) {
            listBook.forEach(book => {
                fetchCommentsForBook(book._id);
            });
        }
    }, [listBook]);

    const handlePopupButtonClick = () => {
        setShowPopup(false); // Đóng popup trước
        navigate('/book/682d4c146c76be99fb301947'); // Chuyển hướng đến trang sách
    };

    return (
        <>
            <Popup isVisible={showPopup} onClose={() => setShowPopup(false)}>
                <div
                    className="home-popup"
                    style={{ background: `url(${popupImg}) center/cover no-repeat` }}
                >
                    <div className="home-popup-content">
                        <button
                            className="home-popup-btn"
                            onClick={handlePopupButtonClick}
                        >
                            Xem ngay
                        </button>
                    </div>
                </div>
            </Popup>
            <div className="homepage-bg">
                <div className="homepage-container">
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div className="homepage-sidebar">
                                <div className="homepage-sidebar-header">
                                    <span>
                                        <FilterTwoTone />
                                        <span className="homepage-sidebar-title"> Bộ lọc tìm kiếm </span>
                                    </span>
                                    <ReloadOutlined title="Reset" onClick={() => {
                                        form.resetFields();
                                        setFilter('');
                                        setStarFilter(null);
                                    }} />
                                </div>
                                <Divider />
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >
                                    <Form.Item
                                        name="category"
                                        label="Danh mục sản phẩm"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                {listCategory?.map((item, index) => {
                                                    return (
                                                        <Col span={24} key={`index-${index}`} style={{}}>
                                                            <Checkbox value={item.value}>
                                                                {item.label}
                                                            </Checkbox>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Khoảng giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={['range', 'from']}>
                                                    <InputNumber
                                                        name="from"
                                                        min={0}
                                                        placeholder="đ TỪ"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xl={2} md={0}>
                                                <div> - </div>
                                            </Col>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={['range', 'to']}>
                                                    <InputNumber
                                                        name="to"
                                                        min={0}
                                                        placeholder="đ ĐẾN"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div>
                                            <Button onClick={() => form.submit()}
                                                style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                        </div>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Đánh giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <div key={star} style={{ cursor: 'pointer' }} onClick={() => setStarFilter(star)}>
                                                <Rate value={star} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                                <span className="ant-rate-text">  trở lên</span>
                                            </div>
                                        ))}
                                        {starFilter && (
                                            <Button size="small" style={{ marginTop: 8 }} onClick={() => setStarFilter(null)}>Bỏ lọc</Button>
                                        )}
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>

                        <Col md={20} xs={24} >
                            <Spin spinning={isLoading} tip="Loading...">
                                <div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
                                    <Row>
                                        <Tabs
                                            defaultActiveKey="sort=-sold"
                                            items={items}
                                            onChange={(value) => setSortQuery(value)}
                                            style={{ overflowX: "auto" }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }} >
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    < FilterTwoTone />
                                                    <span style={{ fontWeight: 500 }}
                                                    > Bộ lọc </span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='customize-row'>
                                        {filteredBooks?.length === 0 ? (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                padding: '40px 0',
                                                color: '#666',
                                                fontSize: '16px'
                                            }}>
                                                Không có sản phẩm
                                            </div>
                                        ) : (
                                            filteredBooks?.map((item, index) => {
                                                const comments = bookComments[item._id] || [];
                                                const avgRating = comments.length > 0
                                                    ? (comments.reduce((sum, c) => sum + (c.star || 0), 0) / comments.length)
                                                    : 0;
                                                const totalComments = comments.length;
                                                return (
                                                    <div
                                                        onClick={() => navigate(`/book/${item._id}`)}
                                                        className="column" key={`book-${index}`}>
                                                        <div className='wrapper'>
                                                            <div className='thumbnail'>
                                                                <img src={getImageUrl(item.thumbnail, 'book')} alt={item.mainText} />
                                                            </div>
                                                            <div className='text' title={item.mainText}>
                                                                {item.mainText}
                                                            </div>
                                                            <div className='price'>
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                            </div>
                                                            <div className='rating'>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#ffb400' }}>
                                                                        {avgRating.toFixed(1)}
                                                                    </div>
                                                                    <Rate value={Number(avgRating.toFixed(1))} allowHalf disabled style={{ color: '#ffce3d', fontSize: 14 }} />
                                                                </div>
                                                                <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
                                                                    ({totalComments} đánh giá)
                                                                </div>
                                                                <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                                                                    Đã bán {item.sold ?? 0}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </Row>
                                    <div style={{ marginTop: 30 }}></div>
                                    <Row style={{ display: "flex", justifyContent: "center" }}>
                                        <Pagination
                                            current={current}
                                            total={total}
                                            pageSize={pageSize}
                                            responsive
                                            onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                        />
                                    </Row>
                                </div>
                            </Spin>
                        </Col >
                    </Row >
                </div >
            </div >
            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />
        </>
    )
}

export default HomePage