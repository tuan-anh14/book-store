import { deleteUserAPI, getBooksAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import DetailBook from './detail.book';
import CreateBook from './create.book';
import ImportBook from './data/import.book';
import { CSVLink } from 'react-csv';


type TSearch = {
    mainText: string,
    author: string,
    price: number,
    createdAt: string,
    createdAtRange: string,
    updatedAt: string,
    updatedAtRange: string

}

const TableBook = () => {

    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);

    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    const { message, notification } = App.useApp();

    const handleDeleteBook = async (_id: string) => {
        setIsDeleteBook(true);
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success('Xóa book thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi xoá book',
                description: res?.message || 'Đã có lỗi xảy ra.',
            });
        }
    };

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(entity);
                        setOpenViewDetail(true);
                    }}>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                );
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            valueType: 'date',
            hideInSearch: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                console.log("Data Update:", entity);
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa sách này ?"}
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        // okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: "20px" }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    </>
                )
            },
        },

    ];

    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {

                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`;
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`;
                        }
                    }

                    const createDateRange = dateRangeValidate(params.createdAtRange);
                    if (createDateRange) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    } else {
                        query += "&sort=-createdAt";
                    }

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`;
                    }

                    if (sort && sort.author) {
                        query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`;
                    }

                    if (sort && sort.price) {
                        query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
                    }

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    };

                }}

                rowKey="_id"

                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal(total, range) {
                        return (
                            <div>{range[0]} - {range[1]} on {total} rows</div>
                        )
                    },
                }}
                headerTitle="Table book"
                toolBarRender={() => [
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename={'export-book.csv'}
                        >
                            Export
                        </CSVLink>
                    </Button>,

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => {
                            setOpenModalImport(true);
                        }}
                    >
                        Import
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />

            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <ImportBook
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableBook;