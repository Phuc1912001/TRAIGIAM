
import { useLoading } from '../../../common/Hook/useLoading';
import { useNotification } from '../../../common/Hook/useNotification';
import { PrisonerModel } from '@/common/Model/prisoner';
import { VisitModel } from '@/common/Model/visit';
import ModalComponent from '../../../Components/ModalDelete/ModalComponent';
import TextItem from '../../../Components/TextItem/TextItem';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import styles from './CreateVisit.module.scss'
import StatusVisit from '../StatusVisit/StatusVisit';

interface ICreateVisit {
    openCreateVisit: boolean;
    setOpenCreateVisit: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    recall: boolean;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: VisitModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IOptionValue {
    label?: string;
    value?: string | number;
}

const CreateVisit = (props: ICreateVisit) => {

    const {
        openCreateVisit,
        setOpenCreateVisit,
        isEdit,
        recall,
        setRecall,
        reset,
        currentRecord,
        isView,
        setIsView,
    } = props;

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();

    const [dataPrisoner, setDataPrisoner] = useState<VisitModel[]>([]);
    const [optionPrisoner, setOptionPrisoner] = useState<IOptionValue[]>([]);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const [data, setData] = useState<any>();

    const storedUserDataString = localStorage.getItem("userData");

    const handleGetAllPrisoner = async () => {
        try {
            showLoading("getAllPrisoner");
            const { data } = await axios.get("https://localhost:7120/api/prisoner");
            setDataPrisoner(data.data);
            let newData = data.data.map((item: PrisonerModel) => ({
                label: item.prisonerName,
                value: item.id,
            }));
            setOptionPrisoner(newData);
            closeLoading("getAllPrisoner");
        } catch (error) {
            closeLoading("getAllPrisoner");
        }
    };

    useEffect(() => {
        handleGetAllPrisoner();
    }, [openCreateVisit]);

    useEffect(() => {
        if (storedUserDataString) {
            const storedUserData = JSON.parse(storedUserDataString ?? "");
            setData(storedUserData);
        }
    }, [storedUserDataString]);

    const onClose = () => {
        setOpenCreateVisit(false);
        setIsView(false);
    };

    const handleOnFinish = async () => {
        try {
            showLoading("CreateVisit");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const startDate = await form.getFieldValue('startDate')
            console.log('startDate', dayjs(startDate).format("DD MM YYYY HH:mm"));

            const currentDateTime = dayjs();

            const model: VisitModel = {
                ...value,
                startDate: dayjs(value.startDate)
                    .hour(currentDateTime.hour())
                    .minute(currentDateTime.minute())
                    .second(currentDateTime.second())
                    .format(),
                endDate: dayjs(value.endDate)
                    .hour(currentDateTime.hour())
                    .minute(currentDateTime.minute())
                    .second(currentDateTime.second())
                    .format(),
                createdBy: data.id
            }
            await axios.post("https://localhost:7120/api/Visit", model);
            notification.success(<div>Tạo Phiếu Thăm Khám thành công.</div>);
            setOpenCreateVisit(false);
            setRecall(!recall);
            closeLoading("CreateVisit");
        } catch (error) {
            closeLoading("CreateVisit");
        }
    };

    const handleOnEdit = async () => {
        try {
            showLoading("EditVisit");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const currentDateTime = dayjs();

            const model: VisitModel = {
                ...value,
                startDate: dayjs(value.startDate)
                    .hour(currentDateTime.hour())
                    .minute(currentDateTime.minute())
                    .second(currentDateTime.second())
                    .format(),
                endDate: dayjs(value.endDate)
                    .hour(currentDateTime.hour())
                    .minute(currentDateTime.minute())
                    .second(currentDateTime.second())
                    .format(),
                id: currentRecord?.id,
            };

            await axios.put(
                `https://localhost:7120/api/Visit/${currentRecord?.id}`,
                model
            );
            notification.success(<div>Sửa Phiếu Thăm Khám thành công.</div>);
            setOpenCreateVisit(false);
            setRecall(!recall);
            closeLoading("EditVisit");
        } catch (error) {
            closeLoading("EditVisit");
        }
    };

    const handleConfirm = async () => {
        try {
            showLoading("ConfirmVisit");
            const model = {
                userId: data.id
            }
            await axios.put(
                `https://localhost:7120/api/Visit/${currentRecord?.id}/confirm`, model
            );
            notification.success(<div>Cặp nhập thành công.</div>);
            setOpenCreateVisit(false);
            setRecall(!recall);
            setIsOpenModal(false)
            closeLoading("ConfirmVisit");
        } catch (error) {
            closeLoading("ConfirmVisit");
        }
    };


    const renderBtn = (status: number) => {
        switch (status) {
            case 0:
                return <div>Chấp Nhận</div>;
            case 1:
                return <div>Đã Xong</div>;
            default:
                break;
        }
    };

    const renderContent = (status: number) => {
        switch (status) {
            case 0:
                return <div>Bạn có chấp nhận cho phạm nhân <span style={{ fontWeight: '600' }}>{currentRecord?.prisonerName}</span> Được thăm gia đình.</div>
            case 1:
                return <div>Phạm Nhân <span style={{ fontWeight: '600' }}>{currentRecord?.prisonerName}</span> đã hoàn thành việc thăm khám.</div>
            default:
                break;
        }
    }
    const handleOpenModel = () => {
        setIsOpenModal(true)
    }

    const filterDrawFooterView = (
        <div className={styles.wrapperBtn}>
            <Button
                onClick={() => {
                    onClose();
                }}
                style={{ minWidth: 80 }}
            >
                Đóng
            </Button>
            <div onClick={handleOnFinish} className="btn-orange">
                Tạo Phiếm Thăm
            </div>
        </div>
    );

    const filterDrawFooter = (
        <div className={styles.wrapperBtn}>
            <Button
                onClick={() => {
                    onClose();
                }}
                style={{ minWidth: 80 }}
            >
                Đóng
            </Button>
            <div onClick={handleOnEdit} className="btn-orange">
                Sửa Phiếu Thăm
            </div>
        </div>
    );

    const footerOnlyView = (
        <div className={styles.wrapperBtn}>
            <Button
                onClick={() => {
                    onClose();
                }}
                style={{ minWidth: 80 }}
            >
                Đóng
            </Button>
            {currentRecord?.status !== 3 && (
                <div onClick={handleOpenModel} className="btn-orange">
                    {renderBtn(currentRecord?.status ?? 0)}
                </div>
            )}
        </div>
    );

    useEffect(() => {
        if (isEdit) {
            const formatData = {
                ...currentRecord,
                startDate: dayjs(currentRecord?.startDate),
                endDate: dayjs(currentRecord?.endDate),
            };
            form.setFieldsValue(formatData);
        } else {
            form.resetFields();
        }
    }, [isEdit, reset]);


    const filterOption = (input: string, option?: IOptionValue) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
        ((option as any)?.email || "").toLowerCase().includes(input.toLowerCase());


    return (
        <div>
            <Drawer
                title={
                    isView
                        ? "Chi tiết Phiếu Thăm Khám"
                        : isEdit
                            ? "Sửa Thăm Khám"
                            : "Tạo Thăm Khám"
                }
                open={openCreateVisit}
                placement="right"
                closable={false}
                rootClassName={styles.EditInfringement}
                extra={<CloseOutlined onClick={onClose} />}
                width={620}
                footer={
                    isView
                        ? footerOnlyView
                        : isEdit
                            ? filterDrawFooter
                            : filterDrawFooterView
                }
                destroyOnClose
                contentWrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
            >
                {isView ? (
                    <div>
                        <Row style={{ height: "100%" }}>
                            <TextItem label="Tên Phạm Nhân">
                                {currentRecord?.prisonerName}
                            </TextItem>
                            <TextItem label="Ngày Bắt Đầu">
                                {dayjs(currentRecord?.startDate).format("DD-MM-YYYY")}
                            </TextItem>
                            <TextItem label="Ngày Kết Thúc">
                                {dayjs(currentRecord?.endDate).format("DD-MM-YYYY")}
                            </TextItem>
                            <TextItem label="Tạo Bởi">
                                {currentRecord?.createdByName}
                            </TextItem>
                            <TextItem label="Chấp Nhận Bởi">
                                {currentRecord?.modifiedByName ?? "N/A"}
                            </TextItem>
                        </Row>
                        <TextItem
                            textItemProps={{ isCol: true, spanNumber: 24 }}
                            label="Lý Do"
                        >
                            {currentRecord?.desc}
                        </TextItem>
                        <TextItem
                            textItemProps={{ isCol: true, spanNumber: 24 }}
                            label="Trạng Thái"
                        >
                            <StatusVisit status={currentRecord?.status} />
                        </TextItem>
                    </div>
                ) : (
                    <Form layout="vertical" form={form}>
                        <Row>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng điền phạm nhân." },
                                    ]}
                                    name="prisonerId"
                                    label="Phạm Nhân:"
                                >
                                    <Select
                                        rootClassName={styles.emFilterSelectMultiple}
                                        placeholder="Chọn phạm nhân"
                                        // loading={!ygm}
                                        options={optionPrisoner}
                                        filterOption={filterOption}
                                    />
                                </Form.Item>
                            </Col>


                            <Col sm={24}>
                                <Form.Item
                                    rules={[{ required: true, message: "Vui lòng điền Mô tả." }]}
                                    name="desc"
                                    label="Mô Tả:"
                                >
                                    <TextArea />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12}>
                                <Form.Item
                                    name="startDate"
                                    label="Ngày Bắt đầu"
                                    required
                                    rules={[
                                        { required: true, message: "This field is required." },
                                    ]}
                                    rootClassName={styles.dateLabel}
                                >
                                    <DatePicker
                                        format="DD MMM YYYY"
                                        inputReadOnly={true}
                                        placeholder="Select a date"
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12}>
                                <Form.Item
                                    name="endDate"
                                    label="Ngày kết thúc"
                                    required
                                    rules={[
                                        { required: true, message: "This field is required." },
                                    ]}
                                    rootClassName={styles.dateLabel}
                                >
                                    <DatePicker
                                        format="DD MMM YYYY"
                                        inputReadOnly={true}
                                        placeholder="Select a date"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Drawer>

            <ModalComponent
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                handleDelete={handleConfirm}
                title="Xác Nhận Phiếu Thăm Khám"
                textConfirm={renderBtn(currentRecord?.status ?? 0)}
            >
                <div>{renderContent(currentRecord?.status ?? 0)}</div>
            </ModalComponent>
        </div>
    )
}

export default CreateVisit