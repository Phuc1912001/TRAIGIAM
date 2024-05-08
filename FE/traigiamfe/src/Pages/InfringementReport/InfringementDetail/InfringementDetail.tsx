import { InfringementResponse } from '@/common/Model/infringement'
import { PrisonerResponse } from '@/common/Model/prisoner'
import { Row, Tooltip } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoading } from '../../../common/Hook/useLoading'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import TextItem from '../../../Components/TextItem/TextItem'
import StatusInfringement from '../StatusInfringement/StatusInfringement'
import styles from './InfringementDetail.module.scss'
import imgage from '../../../assets/default.jpg'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons'
import Table, { ColumnsType } from 'antd/es/table'
import { StatmentModel } from '@/common/Model/statement'
import StatusStatement from '../../Statement/StatusStatement/StatusStatement'



const InfringementDetail = () => {
    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/infringement")
    }
    const { showLoading, closeLoading } = useLoading()

    const items = [
        {
            title: <div>Vi Phạm</div>
        },
        {
            title: <div className={styles.breacrumb} onClick={handleNavigateToList} >Danh Sách Vi Phạm</div>
        },
        {
            title: <div>Chi Tiết Vi Phạm</div>
        },
    ];

    const { id } = useParams()
    const [dataDetail, setDataDetail] = useState<InfringementResponse>()

    const handelGetDetail = async () => {
        try {
            showLoading("detailIR")
            const { data } = await axios.get(`https://localhost:7120/api/infringement/${id}`)
            setDataDetail(data.data)
            closeLoading("detailIR")
        } catch (error) {
            closeLoading("detailIR")
        }

    }
    useEffect(() => {
        handelGetDetail()
    }, [id])

    const handleNavigate = (record: PrisonerResponse) => {
        navigate(`/prisoner/${record.id}`);
    };

    const handleToView = (record: StatmentModel) => {
        // setIsView(true)
        // setCurrentRecord(record)
        // setOpenCreateStatement(true);
    }


    const columns: ColumnsType<StatmentModel> = [
        {
            title: "Tên Phạm Nhân",
            dataIndex: "prisonerName",
            key: "prisonerName",
            render: (_, record) => {
                return (
                    <div onClick={() => handleToView(record)} className={styles.name}>
                        {record.prisonerName}
                    </div>
                );
            },

        },
        {
            title: "Tên Vi Phạm",
            dataIndex: "irName",
            key: "irName",
            render: (_, record) => {
                return <div onClick={() => handleNavigate(record)} className={styles.irName} >{record.irName}</div>
            }
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                return (
                    <div>
                        <StatusStatement status={record?.status ?? 0} />
                    </div>
                );
            },
        },
        // {
        //     title: "Hoạt Động",
        //     dataIndex: "action",
        //     key: "action",
        //     render: (_, record) => (
        //         record.status === 0 &&
        //         <div className={styles.wrapperAction} >
        //             <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
        //                 <EditOutlined style={{ fontSize: 18 }} />
        //             </div>
        //             <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
        //                 <DeleteOutlined style={{ fontSize: 18 }} />
        //             </div>
        //         </div >
        //     ),
        // },
    ];




    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className="share-sticky-mobile" >
                <MobileHeader />
            </div>

            <div className={styles.containerDetail} >
                <h2>Chi Tiết Vi Phạm</h2>

                <Row style={{ height: '100%', marginTop: '40px' }}  >
                    <TextItem label='Mã Vi Phạm' >{dataDetail?.mvp}</TextItem>
                    <TextItem label='Trạng Thái' >
                        <StatusInfringement status={dataDetail?.status} />
                    </TextItem>
                    <TextItem label='Tên Vi Phạm' >{dataDetail?.nameIR}</TextItem>
                    <TextItem label='Địa Điểm' >{dataDetail?.location}</TextItem>
                    <TextItem label='Mức Độ' >{dataDetail?.rivise}</TextItem>
                    <TextItem label='Hình Phạt' >{dataDetail?.punishId}</TextItem>
                    <TextItem label='Thời gian' >{dayjs(dataDetail?.timeInfringement).format("DD MM YYYY")}</TextItem>
                    <TextItem label='Tạo Bởi' >{dataDetail?.createdByName}</TextItem>
                    <TextItem label='Cập Nhập Bởi' >{dataDetail?.modifiedByName ?? 'N/A'}</TextItem>
                </Row>

                <div className={styles.containerPrisoner} >
                    <div className={styles.title} >
                        <h3>Danh sách phạm nhân :</h3>
                    </div>

                    {dataDetail?.listPrisonerStatement?.map((item: PrisonerResponse, index) => (
                        <div>
                            <div key={index} className={styles.containerCard}>

                                <div className={styles.wrapperInfor}>
                                    <div className={styles.containerInfor}>
                                        <div>
                                            <img className={styles.avatar} src={item.imageSrc} alt="Avatar" />
                                        </div>
                                        <div>
                                            <div className={styles.name}>{item.prisonerName}</div>
                                            <div>{`${item.prisonerAge} tuổi`}</div> {/* Assuming item has an age field */}
                                        </div>
                                    </div>
                                    <Tooltip
                                        placement="top"
                                        title={<div className="customTooltip">Cấp bậc này đã tạm nhưng.</div>}
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
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className={styles.expandCard}>
                                <div className={styles.title} >Lời Khai: </div>
                                <Table
                                    columns={columns}
                                    dataSource={Array.isArray(item?.listStatement) ? item.listStatement : []}
                                    className={`${styles.prisonerTable} share-border-table`}
                                    tableLayout="auto"
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default InfringementDetail