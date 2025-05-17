import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, Modal, InputNumber, Select, Upload, Image, Row, Col } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { updateBookAPI, getCategoryAPI, uploadFileAPI } from '@/services/api';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IBookTable | null) => void;
    dataUpdate: IBookTable | null;
}

type FieldType = {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    description: string;
    thumbnail: any;
    slider: any;
};

const UpdateBook = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, setDataUpdate, dataUpdate } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [form] = Form.useForm();

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                description: dataUpdate.description
            });

            // Set thumbnail
            if (dataUpdate.thumbnail) {
                setFileListThumbnail([{
                    uid: '-1',
                    name: dataUpdate.thumbnail,
                    status: 'done' as const,
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`
                }]);
            }

            // Set slider images
            if (dataUpdate.slider && dataUpdate.slider.length > 0) {
                const sliderFiles = dataUpdate.slider.map((image, index) => ({
                    uid: `-${index + 1}`,
                    name: image,
                    status: 'done' as const,
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${image}`
                }));
                setFileListSlider(sliderFiles);
            }
        }
    }, [dataUpdate]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoryAPI();
            if (res.data) {
                setCategories(res.data);
            }
        };
        fetchCategories();
    }, []);

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload: UploadProps['beforeUpload'] = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: 'thumbnail' | 'slider') => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        }

        if (type === 'slider') {
            const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: 'thumbnail' | 'slider') => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileName,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileName}`,
            };

            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
            }

            if (onSuccess) {
                onSuccess('ok')
            }
        } else {
            message.error(res.message)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, mainText, author, price, category, description } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map((item) => item.name) ?? [];

        setIsSubmit(true);

        const res = await updateBookAPI(_id, mainText, author, price, category, description, thumbnail, slider);
        if (res && res.data) {
            message.success('Cập nhật sách thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi cập nhật sách',
                description: res?.message || 'Đã có lỗi xảy ra.',
            });
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Cập nhật sách"
                open={openModalUpdate}
                onOk={() => { form.submit(); }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null)
                    form.resetFields();
                    setFileListThumbnail([]);
                    setFileListSlider([]);
                }}
                okText={"Cập nhật"}
                cancelText={"Huỷ"}
                confirmLoading={isSubmit}
                width="50vw"
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        labelCol={{ span: 24 }}
                        label="_id"
                        name="_id"
                        rules={[{ required: true, message: 'Vui lòng nhập _id!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                            >
                                <Select
                                    options={categories.map(category => ({
                                        value: category._id,
                                        label: category.name
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Ảnh đại diện"
                        name="thumbnail"
                    >
                        <Upload
                            name="thumbnail"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={true}
                            action={`${import.meta.env.VITE_BACKEND_URL}/api/v1/files/upload`}
                            beforeUpload={beforeUpload}
                            fileList={fileListThumbnail}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemove(file, 'thumbnail')}
                            onChange={(info) => handleChange(info, 'thumbnail')}
                            customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                            maxCount={1}
                        >
                            {fileListThumbnail.length >= 1 ? null : (
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Ảnh slider"
                        name="slider"
                    >
                        <Upload
                            name="slider"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={true}
                            action={`${import.meta.env.VITE_BACKEND_URL}/api/v1/files/upload`}
                            beforeUpload={beforeUpload}
                            fileList={fileListSlider}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemove(file, 'slider')}
                            onChange={(info) => handleChange(info, 'slider')}
                            customRequest={(options) => handleUploadFile(options, 'slider')}
                            multiple
                        >
                            {fileListSlider.length >= 8 ? null : (
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={previewOpen}
                title={previewImage}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}

export default UpdateBook;