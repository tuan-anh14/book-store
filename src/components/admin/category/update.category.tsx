import { App, Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { updateCategoryAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: ICategory | null;
    refreshTable: () => void;
}

const UpdateCategory = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, refreshTable } = props;
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({ name: dataUpdate.name });
        }
    }, [dataUpdate, form]);

    const onFinish = async (values: { name: string }) => {
        if (!dataUpdate) return;
        setIsSubmit(true);
        const res = await updateCategoryAPI(dataUpdate._id, values.name);
        if (res && res.data) {
            message.success('Cập nhật danh mục thành công!');
            setOpenModalUpdate(false);
            refreshTable();
        } else {
            message.error('Đã có lỗi xảy ra!');
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật danh mục"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => setOpenModalUpdate(false)}
            okButtonProps={{ loading: isSubmit }}
            okText="Cập nhật"
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

export default UpdateCategory;
