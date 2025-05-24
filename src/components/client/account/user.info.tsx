import { useCurrentApp } from "@/components/context/app.context";
import { updateUserInfoAPI, uploadFileAPI } from "@/services/api";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Col, Form, Input, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import type { UploadFile } from 'antd';
import { FormProps } from "antd/lib";


type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
};


const UserInfo = () => {

    const [form] = Form.useForm();
    const { user, setUser } = useCurrentApp();

    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;


    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                //@ts-ignore
                _id: user._id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
            });
        }
    }, [user, form]);

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "avatar");

        if (res && res.data) {
            const newAvatar = res.data.fileName;
            setUserAvatar(newAvatar);

            if (onSuccess) {
                onSuccess('ok');
            }
        } else {
            message.error(res?.message);
        }
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log("Form values:", values);
        const { fullName, phone, _id } = values;
        setIsSubmit(true);
        const res = await updateUserInfoAPI(_id, userAvatar, fullName, phone);

        if (res && res.data) {
            //update react context
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone
            });
            message.success("Cập nhật thông tin user thành công");
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res?.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12}>
                    <Row gutter={[30, 30]}>
                        <Col span={24}>
                            <Avatar
                                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                icon={<AntDesignOutlined />}
                                src={urlAvatar}
                                shape="circle"
                            />
                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={12}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        name="user-info"
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item<FieldType> name="_id" style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>


                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống!' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Tên hiển thị"
                            name="fullName"
                            rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>

                </Col>
            </Row>
        </div>
    )

}

export default UserInfo;   