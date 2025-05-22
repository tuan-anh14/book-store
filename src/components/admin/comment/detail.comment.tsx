import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE } from "@/services/helper";

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

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width="70vw"
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin Bình luận"
                    bordered
                    column={2}
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
            </Drawer>
        </>
    )
}

export default DetailComment; 