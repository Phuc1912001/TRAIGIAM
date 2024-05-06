import Header from "../../Components/Header/Header";
import { Breadcrumb, Button, Layout, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./Prisoner.module.scss";
import { ColumnsType } from "antd/es/table";
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";
import CreatePrisoner from "./CreatePrisoner/CreatePrisoner";
import avatar from "../../assets/avatar.jpg";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import { PrisonerResponse } from "../../common/Model/prisoner";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import axios from "axios";
import defaultImage from "../../assets/default.jpg";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import { BandingEnum, IBandingMap } from "../../common/Model/banding";

const Prisoner = () => {
    const items = [
        {
            title: <div>Phạm Nhân</div>,
        },
        {
            title: <div>Danh Sách Phạm Nhân</div>,
        },
    ];

    const initialFieldValues = {
        imageName: "",
        imageSrc: defaultImage,
        imageFile: null,
    };

    const navigate = useNavigate();
    const [openCreatePrisoner, setOpenCreatePrisoner] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [namePrisoner, setNamePrisoner] = useState<PrisonerResponse>();
    const [currentRecord, setCurrentRecord] = useState<PrisonerResponse>();

    const [dataPrisoner, setDataPrisoner] = useState<PrisonerResponse[]>([]);
    const notification = useNotification();

    const [values, setValues] = useState(initialFieldValues);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);

    const { showLoading, closeLoading } = useLoading();

    const handleGetAllPrisoner = async () => {
        try {
            showLoading("getAllPrisoner");
            const { data } = await axios.get("https://localhost:7120/api/prisoner");
            setDataPrisoner(data.data);
            closeLoading("getAllPrisoner");
        } catch (error) {
            closeLoading("getAllPrisoner");
        }
    };

    useEffect(() => {
        handleGetAllPrisoner();
    }, []);

    useEffect(() => {
        handleGetAllPrisoner();
    }, [recall]);

    const handleNavigate = (record: any) => {
        navigate(`/prisoner/${record.id}`);
    };
    const handleOpenCreate = () => {
        setOpenCreatePrisoner(true);
        setIsEdit(false);
        setReset(!reset);
    };

    const handleOpenEdit = (record: PrisonerResponse) => {
        setOpenCreatePrisoner(true);
        setIsEdit(true);
        setCurrentRecord(record);
        setValues({
            ...values,
            imageSrc: record.imageSrc as string,
        });
        setShowDelete(true);
        setReset(!reset);
    };

    const handleOpenDelete = (record: PrisonerResponse) => {
        setIsOpenModal(true);
        setNamePrisoner(record);
    };

    const handleDeletePrisoner = async () => {
        try {
            showLoading("deletePrisoner");
            await axios.delete(
                `https://localhost:7120/api/prisoner/${namePrisoner?.id}`
            );
            handleGetAllPrisoner();
            setIsOpenModal(false);
            notification.success(<div>Xóa Phạm Nhân Thành Công.</div>);
            closeLoading("deletePrisoner");
        } catch (error) {
            setIsOpenModal(true);
            closeLoading("deletePrisoner");
        }
    };

    const columns: ColumnsType<PrisonerResponse> = [
        {
            title: "Tên Phạm Nhân",
            dataIndex: "prisonerName",
            key: "prisonerName",
            render: (_, record) => {
                const arr = record?.imageSrc?.split("/");
                const hasNull = arr?.includes("null");
                const imgURL = hasNull ? defaultImage : record.imageSrc;
                return (
                    <div className={styles.wrapperInfor}>
                        <div className={styles.containerInfor}>
                            <div>
                                <img className={styles.avatar} src={imgURL} alt="" />
                            </div>
                            <div>
                                <div
                                    className={styles.name}
                                    onClick={() => handleNavigate(record)}
                                >
                                    {record?.prisonerName}
                                </div>
                                <div>{`${record?.prisonerAge} tuổi`}</div>
                            </div>
                        </div>
                        <img
                            alt="banding"
                            src={IBandingMap.get((record?.bandingID ?? 10) as BandingEnum)}
                        />
                        {
                            !record.isActiveBanding && <Tooltip
                                placement="top"
                                title={
                                    <div className={"customTooltip"}>
                                        {`Cấp bậc này đã tạm nhưng.`}
                                    </div>
                                }
                                color="#ffffff"
                                arrow={true}
                            >
                                <InfoCircleOutlined
                                    style={{
                                        color: '#D01B1B',
                                        borderRadius: '10px',
                                        width: '16px',
                                        height: '16px',
                                        marginLeft: '8px',
                                        fontSize: '16px',
                                        cursor: "pointer"
                                    }}
                                />
                            </Tooltip>
                        }

                    </div>
                );
            },
        },
        {
            title: "Ma Phạm Nhân",
            dataIndex: "mpn",
            key: "mpn",
        },
        {
            title: "Trại",
            dataIndex: "dom",
            key: "dom",
        },
        {
            title: "Người Quản Lý",
            dataIndex: "manangerName",
            key: "manangerName",
        },
        {
            title: "Hoạt Động",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                record.isActiveBanding && (
                    <div className={styles.wrapperAction} >
                        <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
                            <EditOutlined style={{ fontSize: 18 }} />
                        </div>
                        <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
                            <DeleteOutlined style={{ fontSize: 18 }} />
                        </div>
                    </div >
                )

            ),
        },
    ];

    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className="share-sticky-mobile">
                <MobileHeader />
            </div>

            <div className={styles.wrapperContent}>
                <div className={styles.wrapperBtn}>
                    <div className={"createBtn"} onClick={handleOpenCreate}>
                        <PlusCircleOutlined style={{ fontSize: 18 }} />
                        Tạo Phạm Nhân
                    </div>
                    <div>search</div>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataPrisoner}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                />
            </div>
            <CreatePrisoner
                openCreatePrisoner={openCreatePrisoner}
                setOpenCreatePrisoner={setOpenCreatePrisoner}
                isEdit={isEdit}
                currentRecord={currentRecord}
                values={values}
                setValues={setValues}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                initialFieldValues={initialFieldValues}
                setRecall={setRecall}
                recall={recall}
                reset={reset}
            />
            <ModalComponent
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                handleDelete={handleDeletePrisoner}
                title="Xác Nhận Xóa Phạm Nhân"
                textConfirm="Xóa Phạm Nhân"
            >
                <div>{`Bạn có muốn xóa phạm nhân ${namePrisoner?.prisonerName}`}</div>
            </ModalComponent>
        </div>
    );
};

export default Prisoner;
