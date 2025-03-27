import { FORMATE_DATE } from "@/services/helper";
import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser: React.FC<IProps> = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }) => {
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;

    return (
        <Drawer title="User Details" width={"50vw"} onClose={onClose} open={openViewDetail}>
            <Descriptions title="User Information" bordered column={2}>
                <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Full Name">{dataViewDetail?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{dataViewDetail?.phone}</Descriptions.Item>

                <Descriptions.Item label="Role">
                    <Badge status="processing" text={dataViewDetail?.role} />
                </Descriptions.Item>

                <Descriptions.Item label="Avatar">
                    <Avatar size={40} src={avatarURL}></Avatar>
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                    {dataViewDetail?.createdAt ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE) : "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                    {dataViewDetail?.updatedAt ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE) : "N/A"}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailUser;
