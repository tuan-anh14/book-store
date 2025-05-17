import { getCategoryAPI, deleteCategoryAPI } from '@/services/api';
import { EditTwoTone, DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useState, useRef } from 'react';
import CreateCategory from './create.category';
import UpdateCategory from './update.category';

const TableCategory = () => {
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<ICategory | null>(null);
    const actionRef = useRef<ActionType | null>(null);
    const { message } = App.useApp();

    const handleDeleteCategory = async (_id: string) => {
        const res = await deleteCategoryAPI(_id);
        if (res && res.data) {
            message.success('Xóa danh mục thành công');
            refreshTable();
        } else {
            message.error('Đã có lỗi xảy ra!');
        }
    };

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const columns: ProColumns<ICategory>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'name',
            sorter: false,
            ellipsis: true,
            width: 200
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'date',
            search: false,
            sorter: true,
            width: 150
        },
        {
            title: 'Action',
            hideInSearch: true,
            width: 100,
            render: (_, entity) => (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer", marginRight: 15 }}
                        onClick={() => {
                            setDataUpdate(entity);
                            setOpenModalUpdate(true);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa danh mục"}
                        description={"Bạn có chắc chắn muốn xóa thể loại này ?"}
                        onConfirm={() => handleDeleteCategory(entity._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", marginLeft: "20px" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <>
            <ProTable<ICategory, { name?: string }>
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    let query = `current=${params.current || 1}&pageSize=${params.pageSize || 10}`;
                    if (params.name) {
                        query += `&name=/${params.name}/i`;
                    }
                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === "ascend" ? "updatedAt" : "-updatedAt"}`;
                    } else {
                        query += "&sort=-updatedAt";
                    }
                    const res = await getCategoryAPI();
                    if (res && res.data) {
                        // if (res.data.result && res.data.meta) {
                        //     return {
                        //         data: res.data.result,
                        //         success: true,
                        //         total: res.data.meta.total,
                        //     };
                        // }
                        // return {
                        //     data: res.data,
                        //     success: true,
                        //     total: res.data.length,
                        // };
                    }
                    return {
                        data: [],
                        success: false,
                        total: 0,
                    };
                }}
                rowKey="_id"
                search={{
                    labelWidth: 'auto',
                    span: 6,
                }}
                pagination={{
                    showSizeChanger: true,
                }}
                headerTitle="Table Category"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenModalCreate(true)}
                        type="primary"
                    >
                        Thêm mới
                    </Button>
                ]}
            />
            <CreateCategory
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateCategory
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableCategory;