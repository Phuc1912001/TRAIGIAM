import { useLoading } from '../../../common/Hook/useLoading';
import { useNotification } from '../../../common/Hook/useNotification';
import { CheckInCheckOutModel } from '@/common/Model/checkincheckout';
import { useForm } from 'antd/es/form/Form';
import React from 'react'
import styles from './CreateExternal.module.scss'
import { Button, Col, Drawer, Form, Input, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import TextItem from '@/Components/TextItem/TextItem';
import TextArea from 'antd/es/input/TextArea';

interface ICreateExternal {
    openCreateExternal: boolean;
    setOpenCreateExternal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    recall: boolean;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: CheckInCheckOutModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateExternal = (props: ICreateExternal) => {
    const {
        openCreateExternal,
        setOpenCreateExternal,
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
        setOpenCreateExternal(false);
        setIsView(false)
    };

    const handleOnFinish = async () => {

    };


    const handleOnEdit = async () => {

    };

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
                Tạo Xuất Nhập
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
                Sửa Xuất Nhập
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


    return (
        <div>
            <Drawer
                title={isView ? "Chi tiết hình phạt" : isEdit ? "Sửa Hình Phạt" : "Tạo Hình Phạt"}
                open={openCreateExternal}
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
                        {/* <TextItem label='Tên Hình Phạt' >{currentRecord?.punishName}</TextItem>
                        <TextItem label='Mô Tả' >{currentRecord?.desc}</TextItem>
                        <TextItem label='Trạng Thái' >{currentRecord?.status ? 'Hiệu Lực' : 'Tạm Ngưng'}</TextItem> */}
                    </div> : <Form layout="vertical" form={form}>
                        <Row>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng điền tên hình phạt." },
                                    ]}
                                    name="punishName"
                                    label="Tên Hình Phạt:"
                                >
                                    <Input maxLength={150} />
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
                        </Row>
                    </Form>

                }

            </Drawer>
        </div>
    )
}

export default CreateExternal