import React, { useEffect, useState } from 'react';
import { App, Button, Col, Divider, InputNumber, Row } from 'antd';
import 'styles/order.scss';
import { DeleteOutlined, DeleteTwoTone } from '@ant-design/icons';
import { useCurrentApp } from '@/components/context/app.context';
import { getImageUrl } from '@/services/helper';


interface IProps {
    setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
    const { setCurrentStep } = props;
    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);

    const { message } = App.useApp();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || +value < 1) return;
        if (!isNaN(+value)) {
            //update localStorage
            const cartStorage = localStorage.getItem("carts");
            if (cartStorage && book) {
                //update
                const carts = JSON.parse(cartStorage) as ICart[];
                //check exist
                let isExistIndex = carts.findIndex(c => c._id === book?._id);
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value;
                }
                localStorage.setItem("carts", JSON.stringify(carts));
                //sync React Context
                setCarts(carts);
            }
        }
    };

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];

            const newCarts = carts.filter(item => item._id !== _id);

            localStorage.setItem("carts", JSON.stringify(newCarts));

            //sync React Context
            setCarts(newCarts);
        }
    }

    const handleNextStep = () => {
        if (!carts.length) {
            message.error("Không tồn tại sản phẩm trong giỏ hàng.");
            return;
        }
        setCurrentStep(1);
    };


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {carts?.map((item, index) => {
                            const currentBookPrice = item?.detail?.price ?? 0;
                            return (
                                <div className='order-book' key={`index-${index}`}>
                                    <div className='book-content'>
                                        <img src={getImageUrl(item?.detail.thumbnail, 'book')} />
                                        <div className='title'>
                                            {item?.detail?.mainText}
                                        </div>
                                        <div className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                        </div>
                                    </div>
                                    <div className='action'>
                                        <div className='quantity'>
                                            <InputNumber
                                                onChange={(value) => handleOnChangeInput(value as number, item.detail)}
                                                value={item?.quantity}
                                            />
                                        </div>
                                        <div className='sum'>
                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * item?.quantity)}
                                        </div>
                                        <DeleteTwoTone
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleRemoveBook(item._id)}
                                            twoToneColor="#eb2f96"
                                        />
                                    </div>
                                </div>
                            )
                        })

                        }

                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span>Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span>Tổng tiền</span>
                                <span className='sum-final'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <Button
                                color='danger' variant='solid'
                                onClick={() => handleNextStep()}
                            >
                                Mua Hàng ({carts?.length ?? 0})
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default OrderDetail;