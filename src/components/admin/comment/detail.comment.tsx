import { Descriptions, Drawer, Divider, Image, Upload, Grid } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE, getImageUrl } from "@/services/helper";
import { useEffect, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: ICommentTable | null;
    setDataViewDetail: (v: ICommentTable | null) => void;
}

const DetailComment = (props: IProps) => {
    const {
        openViewDetail,
        setOpenViewDetail,
        dataViewDetail,
        setDataViewDetail,
    } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataViewDetail?.images && dataViewDetail.images.length > 0) {
            const imgFiles: UploadFile[] = dataViewDetail.images.map((img) => {
                return {
                    uid: uuidv4(),
                    name: img,
                    status: 'done',
                    url: getImageUrl(img, 'comment'),
                };
            });
            setFileList(imgFiles);
        } else {
            setFileList([]);
        }
    }, [dataViewDetail]);

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
        setFileList([]);
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={screens.md ? "70vw" : "100%"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin Bình luận"
                    bordered
                    column={{ xs: 1, sm: 2, md: 2 }}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Người dùng">{dataViewDetail?.user?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Sách">{dataViewDetail?.book?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Đánh giá">{dataViewDetail?.star} sao</Descriptions.Item>
                    <Descriptions.Item label="Nội dung" span={2}>
                        {dataViewDetail?.content}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Ảnh Bình luận</Divider>
                <div style={{ padding: '20px' }}>
                    <Upload
                        action="#"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        showUploadList={{ showRemoveIcon: false }}
                        disabled={true}
                    >
                        {fileList.length >= 1 ? null : (
                            <div style={{ color: '#aaa', fontSize: 12 }}>
                                Không có ảnh bình luận
                            </div>
                        )}
                    </Upload>
                </div>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailComment; 