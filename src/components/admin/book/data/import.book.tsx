import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { App, message, Modal, notification, Table, Upload } from 'antd';
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { bulkCreateBookAPI } from '@/services/api';
import templateFile from "assets/template/book.xlsx?url";

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    mainText: string,
    author: string,
    category: string,
    price: number,
    description: string
}

const ImportBook = (props: IProps) => {
    const { setOpenModalImport, openModalImport, refreshTable } = props;

    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
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
                        const workbook = new Exceljs.Workbook();
                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        await workbook.xlsx.load(buffer);

                        let jsonData: IDataImport[] = [];

                        const worksheet = workbook.worksheets[0];
                        const headerRow = worksheet.getRow(1);
                        const headers: string[] = [];
                        headerRow.eachCell((cell, colNumber) => {
                            headers[colNumber] = cell.value?.toString() || '';
                            console.log(`Cột ${colNumber}: ${headers[colNumber]}`);
                        });

                        worksheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) return;

                            const bookData: IDataImport = {
                                mainText: '',
                                author: '',
                                category: '',
                                price: 0,
                                description: ''
                            };

                            row.eachCell((cell, colNumber) => {
                                const header = headers[colNumber];
                                let value = '';

                                if (cell.value === null || cell.value === undefined) {
                                    value = '';
                                } else if (typeof cell.value === 'object') {
                                    if ('text' in cell.value) {
                                        value = cell.value.text as string;
                                    } else if ('richText' in cell.value) {
                                        value = cell.value.richText.map((rt: any) => rt.text).join('');
                                    } else if ('hyperlink' in cell.value) {
                                        value = cell.value.hyperlink as string;
                                    } else {
                                        try {
                                            value = cell.text || cell.value.toString();
                                        } catch (e) {
                                            value = '';
                                        }
                                    }
                                } else {
                                    value = cell.value.toString();
                                }

                                console.log(`  ${header}: ${value} (kiểu: ${typeof cell.value})`);

                                if (header.toLowerCase() === 'maintext') {
                                    bookData.mainText = value;
                                } else if (header.toLowerCase() === 'author') {
                                    bookData.author = value;
                                } else if (header.toLowerCase() === 'category') {
                                    bookData.category = value;
                                } else if (header.toLowerCase() === 'price') {
                                    bookData.price = parseFloat(value) || 0;
                                } else if (header.toLowerCase() === 'description') {
                                    bookData.description = value;
                                }
                            });

                            jsonData.push(bookData);
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
        const res = await bulkCreateBookAPI(dataImport);
        if (res.data) {
            notification.success({
                message: "Bulk Create Books",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
            });
            message.success('Create books successfully', 2);
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
                title="Import data book"
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
                            { dataIndex: 'mainText', title: 'Tên sách' },
                            { dataIndex: 'author', title: 'Tác giả' },
                            { dataIndex: 'category', title: 'Thể loại' },
                            { dataIndex: 'price', title: 'Giá tiền' },
                            { dataIndex: '  ', title: 'Mô tả' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    );
};

export default ImportBook;
