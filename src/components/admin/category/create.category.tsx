import { App, Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { createCategoryAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

const CreateCategory = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: { name: string }) => {
        setIsSubmit(true);
        const res = await createCategoryAPI(values.name);
        if (res && res.data) {
            message.success('Tạo mới danh mục thành công!');
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            message.error('Đã có lỗi xảy ra!');
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Thêm mới danh mục"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                form.resetFields();
                setOpenModalCreate(false);
            }}
            okButtonProps={{ loading: isSubmit }}
            okText="Tạo mới"
            cancelText="Hủy"
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tên danh mục"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCategory;
