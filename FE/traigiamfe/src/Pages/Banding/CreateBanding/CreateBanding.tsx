import { useLoading } from '../../../common/Hook/useLoading';
import { useNotification } from '../../../common/Hook/useNotification';
import { BandingModel, IBandingMap, IBandingTextMap } from '../../../common/Model/banding';
import { BandingEnum } from '../../../common/Model/banding'
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react'
import styles from './CreateBanding.module.scss'
import { Button, Col, Drawer, Form, Input, Row, Select, Switch } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import TextItem from '../../../Components/TextItem/TextItem';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import StatusPunish from '../../../Pages/Punishment/StatusPunish/StatusPunish';

interface ICreateBanding {
    openCreatePunish: boolean;
    setOpenCreatePunish: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    recall: boolean;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: BandingModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IOptionValue {
    label?: string;
    value?: string | number;
}

const CreateBanding = (props: ICreateBanding) => {
    const {
        openCreatePunish,
        setOpenCreatePunish,
        isEdit,
        recall,
        setRecall,
        reset,
        currentRecord,
        isView,
        setIsView
    } = props;

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();
    const onClose = () => {
        setOpenCreatePunish(false);
        setIsView(false)
    };

    const handleOnFinish = async () => {
        try {
            showLoading("createBanding");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: BandingModel = {
                bandingID: value.bandingID,
                desc: value.desc,
                status: value.status ?? true
            }
            await axios.post("https://localhost:7120/api/Banding", model);
            notification.success(<div>Tạo Cấp Bậc Thành Công.</div>);
            setOpenCreatePunish(false);
            setRecall(!recall);
            closeLoading("createBanding");
        } catch (error) {
            closeLoading("createBanding");

        }
    };

    const handleOnEdit = async () => {
        try {
            showLoading("editBanding");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: BandingModel = {
                id: currentRecord?.id,
                bandingID: value.bandingID,
                desc: value.desc,
                status: value.status ?? true
            }
            await axios.put(`https://localhost:7120/api/Banding/${currentRecord?.id}`, model);
            notification.success(<div>Sửa Cấp Bậc Thành Công.</div>);
            setOpenCreatePunish(false);
            setRecall(!recall);
            closeLoading("editBanding");
        } catch (error) {
            closeLoading("editBanding");

        }
    };
    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue(currentRecord);
        } else {
            form.resetFields();
        }
    }, [isEdit, reset]);

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
                Tạo Cấp Bậc
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
                Sửa Cấp Bậc
            </div>
        </div>
    );

    const footerOnlyView = (
        <div>
            <Button
                onClick={() => {
                    onClose();
                }}
                style={{ minWidth: 80 }}
            >
                Đóng
            </Button>
        </div>
    )

    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

    const filterOption = (input: string, option?: IOptionValue) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
        ((option as any)?.email || "").toLowerCase().includes(input.toLowerCase());

    const optionBaningType = [
        { label: "Người Mới", value: BandingEnum.Entry },
        { label: "Đồng", value: BandingEnum.Bronze },
        { label: "Bạc", value: BandingEnum.Silver },
        { label: "Vàng", value: BandingEnum.Gold },
        { label: "Kim Cương", value: BandingEnum.Diamond },
    ];

    return (
        <div>
            <Drawer
                title={isView ? "Chi tiết Cấp Bậc" : isEdit ? "Sửa Cấp Bậc" : "Tạo Cấp Bậc"}
                open={openCreatePunish}
                placement="right"
                closable={false}
                rootClassName={styles.EditInfringement}
                extra={<CloseOutlined onClick={onClose} />}
                width={620}
                footer={isView ? footerOnlyView : isEdit ? filterDrawFooter : filterDrawFooterView}
                destroyOnClose
                contentWrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
            >
                {
                    isView ? <div>
                        <TextItem label='Tên Cấp Bậc' textItemProps={{ isCol: true, spanNumber: 24 }}  >
                            <div className={styles.bandingName}  >
                                <img alt="banding" src={IBandingMap.get((currentRecord?.bandingID ?? 10) as BandingEnum)} />
                                {IBandingTextMap.get(currentRecord?.bandingID ?? BandingEnum.Entry)}
                            </div>
                        </TextItem>
                        <TextItem label='Mô Tả' textItemProps={{ isCol: true, spanNumber: 24 }}  >{currentRecord?.desc}</TextItem>
                        <TextItem label='Trạng Thái' textItemProps={{ isCol: true, spanNumber: 24 }}  >
                            <StatusPunish status={currentRecord?.status} />
                        </TextItem>
                    </div> : <Form layout="vertical" form={form}>
                        <Row>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn loại cấp bậc.",
                                        },
                                    ]}
                                    name="bandingID"
                                    label="Loại Cấp bậc:"
                                >
                                    <Select
                                        rootClassName={styles.emFilterSelectMultiple}
                                        placeholder="Chọn loại cấp bậc"
                                        // loading={!ygm}
                                        options={optionBaningType}
                                        filterOption={filterOption}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[{ required: true, message: "Vui lòng điền mô tả." }]}
                                    name="desc"
                                    label="Mô tả:"
                                >
                                    <TextArea />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="status"
                                    label="Trạng Thái:"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checked={currentRecord?.status === true}
                                        defaultValue={true}
                                        onChange={onChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }
            </Drawer>
        </div>
    )
}

export default CreateBanding