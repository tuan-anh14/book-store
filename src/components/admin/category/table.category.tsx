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
    const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false);
    const actionRef = useRef<ActionType | null>(null);
    const { message, notification } = App.useApp();

    const handleDeleteCategory = async (_id: string) => {
        setIsDeleteCategory(true);
        const res = await deleteCategoryAPI(_id);
        if (res && res.data) {
            message.success('Xóa danh mục thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi xoá danh mục',
                description: res?.message || 'Đã có lỗi xảy ra.',
            });
        }
        setIsDeleteCategory(false);
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
            render(dom, entity) {
                return (
                    <a href='#' onClick={() => {
                    }}>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'name',
            sorter: false,
            ellipsis: true,
            width: 200,
            search: true
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
                        okButtonProps={{ loading: isDeleteCategory }}
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
                    const res = await getCategoryAPI();
                    if (res && res.data) {
                        let filteredData = [...res.data];

                        // Filter by name if search is provided
                        const searchName = params?.name;
                        if (searchName) {
                            filteredData = filteredData.filter(item =>
                                item.name.toLowerCase().includes(searchName.toLowerCase())
                            );
                        }

                        // Sort by updatedAt if sort is provided
                        if (sort && sort.updatedAt) {
                            filteredData.sort((a, b) => {
                                const dateA = new Date(a.updatedAt).getTime();
                                const dateB = new Date(b.updatedAt).getTime();
                                return sort.updatedAt === 'ascend' ? dateA - dateB : dateB - dateA;
                            });
                        }

                        // Calculate pagination
                        const current = params?.current || 1;
                        const pageSize = params?.pageSize || 10;
                        const start = (current - 1) * pageSize;
                        const end = start + pageSize;
                        const paginatedData = filteredData.slice(start, end);

                        return {
                            data: paginatedData,
                            success: true,
                            total: filteredData.length,
                        };
                    }
                    return {
                        data: [],
                        success: false,
                        total: 0,
                    };
                }}
                rowKey="_id"
                headerTitle="Table Category"
                search={{
                    labelWidth: 'auto',
                    span: {
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 8,
                        xl: 8,
                        xxl: 6,
                    },
                }}
                scroll={{ x: true }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenModalCreate(true)}
                        type="primary"
                    >
                        Add new
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