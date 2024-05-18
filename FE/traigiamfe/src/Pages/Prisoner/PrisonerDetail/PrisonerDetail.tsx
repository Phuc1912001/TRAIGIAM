import Header from '../../../Components/Header/Header'
import React, { useEffect, useState } from 'react'
import styles from './PrisonerDetail.module.scss'
import { useNavigate } from 'react-router-dom'
import avatar from '../../../assets/avatar.jpg'
import { Row, Table } from 'antd'
import TextItem from '../../../Components/TextItem/TextItem'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import { useParams } from 'react-router-dom'
import { PrisonerModel, PrisonerResponse } from '@/common/Model/prisoner'
import axios from 'axios'
import { useLoading } from '../../../common/Hook/useLoading'
import { ColumnsType } from 'antd/es/table'
import { CheckInCheckOutModel } from '@/common/Model/checkincheckout'
import StatusExternal from '../../CheckInCheckOut/StatusExternal/StatusExternal'
import dayjs from 'dayjs'

const PrisonerDetail = () => {
    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/")
    }
    const { showLoading, closeLoading } = useLoading()

    const items = [
        {
            title: <div>Phạm Nhân</div>
        },
        {
            title: <div className={styles.breacrumb} onClick={handleNavigateToList} >Danh Sách Phạm Nhân</div>
        },
        {
            title: <div>Chi Tiết Phạm Nhân</div>
        },
    ];

    const { id } = useParams()
    const [dataDetail, setDataDetail] = useState<PrisonerResponse>()


    const handelGetDetail = async () => {
        try {
            showLoading("detailPrisoner")
            const { data } = await axios.get(`https://localhost:7120/api/Prisoner/${id}`)
            setDataDetail(data.data)
            closeLoading("detailPrisoner")
        } catch (error) {
            closeLoading("detailPrisoner")
        }

    }
    useEffect(() => {
        handelGetDetail()
    }, [id])


    const handleToViewExternal = (record: CheckInCheckOutModel) => {
        // setIsView(true);
        // setCurentRecord(record);
        // setOpenCreateExternal(true);
    };

    const genderEMType = (emtype: number) => {
        switch (emtype) {
            case 1:
                return <div>Nhập Viện</div>;
            case 2:
                return <div>Ra Tòa</div>;
            case 3:
                return <div>Đi Điều Tra</div>;
            default:
                break;
        }
    };


    const columns: ColumnsType<CheckInCheckOutModel> = [
        {
            title: "Tên Phạm Nhân",
            dataIndex: "prisonerName",
            key: "prisonerName",
            render: (_, record) => {
                return (
                    <div onClick={() => handleToViewExternal(record)} className={styles.name}>
                        {record.prisonerName}
                    </div>
                );
            },
        },
        {
            title: "Loại Xuât nhập",
            dataIndex: "emtype",
            key: "emtype",
            render: (_, record) => {
                return <div>{genderEMType(record.emtype ?? 0)}</div>;
            },
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                return (
                    <div>
                        <StatusExternal status={record?.status} />
                    </div>
                );
            },
        },
        {
            title: "Ngày Bắt Đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (_, record) => {
                return <div>{dayjs(record?.startDate).format("DD-MM-YYYY")}</div>;
            },
        },
        {
            title: "Ngày Kết Thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (_, record) => {
                return <div>{dayjs(record?.endDate).format("DD-MM-YYYY")}</div>;
            },
        },

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
                <h2>Chi Tiết Phạm Nhân</h2>
                <div className={styles.wrapperInfor} >
                    <div>
                        <img className={styles.avatar} src={dataDetail?.imageSrc} alt="" />
                    </div>
                    <div>
                        <h3>{dataDetail?.prisonerName}</h3>
                        <div className={styles.age} >{dataDetail?.prisonerAge} age</div>
                    </div>
                </div>
                <Row style={{ height: '100%' }}  >
                    <TextItem label='Mã Phạm Nhân' >{dataDetail?.mpn}</TextItem>
                    <TextItem label='Giới Tính' >{dataDetail?.prisonerSex}</TextItem>
                    <TextItem label='Căn Cước Công Dân'>{dataDetail?.cccd}</TextItem>
                    <TextItem label='Quê Quán'>{dataDetail?.countryside}</TextItem>
                    <TextItem label='Số Phòng'>{dataDetail?.domId}</TextItem>
                    <TextItem label='Số Giường'>{dataDetail?.bedId}</TextItem>
                    <TextItem label='Tội Danh'>{dataDetail?.crime}</TextItem>
                    <TextItem label='Số Năm'>{dataDetail?.years}</TextItem>
                    <TextItem label='Người Quản Lý'>{dataDetail?.mananger}</TextItem>
                </Row>

                <h3 className={styles.titleHistory} >Lịch Sử Ra Vào :</h3>
                {
                    dataDetail?.listExternal && dataDetail?.listExternal?.length > 0 ?
                        <Table
                            columns={columns}
                            dataSource={dataDetail?.listExternal}
                            className={`${styles.prisonerTable} share-border-table`}
                            tableLayout="auto"
                        /> : <div>Không tồn tại lịch sử </div>
                }


                <h3 className={styles.titleHistory} >Lịch Sử Thăm Khám :</h3>
                <Table
                    columns={columns}
                    dataSource={dataDetail?.listExternal}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                />
            </div>
        </div>
    )
}

export default PrisonerDetail