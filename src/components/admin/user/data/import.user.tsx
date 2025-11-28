import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { App, message, Modal, notification, Table, Upload } from 'antd';
import Exceljs from 'exceljs';

import { bulkCreateUserAPI } from '@/services/api';
import templateFile from "assets/template/user.xlsx?url";

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string,
    email: string,
    phone: string,
    password: string
}

const ImportUser = (props: IProps) => {
    const { setOpenModalImport, openModalImport, refreshTable } = props;

    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        //HTML Input="file" Accept Attribute File Type (CSV)
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        //upload success
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`, 1);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;

                    if (!file) {
                        message.error('Không thể đọc file, vui lòng thử lại');
                        return;
                    }

                    try {
                        // load file to buffer
                        const workbook = new Exceljs.Workbook();
                        const arrayBuffer = await file.arrayBuffer();
                        await workbook.xlsx.load(arrayBuffer);

                        // convert file to json
                        let jsonData: IDataImport[] = [];

                        const worksheet = workbook.worksheets[0]; // Lấy sheet đầu tiên

                        // Debug: In ra các tiêu đề cột
                        const headerRow = worksheet.getRow(1);
                        const headers: string[] = [];
                        headerRow.eachCell((cell, colNumber) => {
                            headers[colNumber] = cell.value?.toString() || '';
                            console.log(`Cột ${colNumber}: ${headers[colNumber]}`);
                        });

                        // Đọc từng dòng dữ liệu
                        worksheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) return; // Bỏ qua hàng tiêu đề

                            const userData: IDataImport = {
                                fullName: '',
                                email: '',
                                phone: '',
                                password: ''
                            };

                            row.eachCell((cell, colNumber) => {
                                const header = headers[colNumber];

                                // Xử lý đúng kiểu dữ liệu của ô Excel
                                let value = '';

                                if (cell.value === null || cell.value === undefined) {
                                    value = '';
                                } else if (typeof cell.value === 'object') {
                                    // Đối với kiểu dữ liệu phức tạp như Rich Text hoặc đối tượng khác
                                    const cellValue = cell.value as any;
                                    if (cellValue.text) {
                                        value = cellValue.text;
                                    } else if (cellValue.richText) {
                                        value = cellValue.richText.map((rt: any) => rt.text).join('');
                                    } else if (cellValue.hyperlink) {
                                        value = cellValue.hyperlink;
                                    } else {
                                        // Cố gắng chuyển đổi nếu có thể
                                        try {
                                            value = cell.text || cell.value.toString();
                                        } catch (e) {
                                            value = '';
                                        }
                                    }
                                } else {
                                    // Kiểu dữ liệu đơn giản (string, number, etc.)
                                    value = cell.value.toString();
                                }

                                console.log(`  ${header}: ${value} (kiểu: ${typeof cell.value})`);

                                // Ánh xạ dữ liệu theo tên cột
                                if (header.toLowerCase() === 'fullname') {
                                    userData.fullName = value;
                                } else if (header.toLowerCase() === 'email') {
                                    userData.email = value;
                                } else if (header.toLowerCase() === 'phone') {
                                    userData.phone = value;
                                }
                                else if (header.toLowerCase() === 'password') {
                                    userData.password = value;
                                }
                            });

                            jsonData.push(userData);
                        });
                        setDataImport(jsonData);
                    } catch (error: any) {
                        message.error(`Lỗi khi đọc file: ${error.message}`);
                    }
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            ...item,
            //   password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
        }));
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
            });
            message.success('Create user successfully', 2);
            refreshTable();
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    };

    return (
        <>
            <Modal
                title="Import data user"
                width={"50vw"}
                open={openModalImport}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                // do not close when click outside
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx
                        &nbsp;
                        <a onClick={e => e.stopPropagation()} href={templateFile} download>
                            Download Sample File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => <span>Dữ liệu upload:</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                            { dataIndex: 'password', title: 'Mật khẩu' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    );
};

export default ImportUser;