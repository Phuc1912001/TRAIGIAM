import { PrisonerResponse } from '@/common/Model/prisoner'
import { StaffModelDetail } from '@/common/Model/staff'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Row, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import defaultImage from "../../../assets/default.jpg"
import { useLoading } from '../../../common/Hook/useLoading'
import { BandingEnum, IBandingMap } from '../../../common/Model/banding'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import TextItem from '../../../Components/TextItem/TextItem'
import styles from './StaffDetail.module.scss'


const StaffDetail = () => {
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
    const [dataDetail, setDataDetail] = useState<StaffModelDetail>()

    const handelGetDetail = async () => {
        try {
            showLoading("detailStaff")
            const { data } = await axios.get(`https://localhost:7120/api/Staff/${id}`)
            setDataDetail(data.data)
            closeLoading("detailStaff")
        } catch (error) {
            closeLoading("detailStaff")
        }

    }
    useEffect(() => {
        handelGetDetail()
    }, [id])

    const handleNavigate = (record: StaffModelDetail) => {
        navigate(`/prisoner/${record.id}`);
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
            title: "Giới tính",
            dataIndex: "prisonerSex",
            key: "prisonerSex",
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
                <h2>Chi Tiết Nhân Viên</h2>
                <div className={styles.wrapperInfor} >
                    <div>
                        <img className={styles.avatar} src={dataDetail?.imageSrc} alt="" />
                    </div>
                    <div>
                        <h3>{dataDetail?.staffName}</h3>
                        <div className={styles.age} >{dataDetail?.staffAge} age</div>
                    </div>
                </div>
                <Row style={{ height: '100%', marginBottom: '20px' }}  >
                    <TextItem label='Mã Phạm Nhân' >{dataDetail?.mnv}</TextItem>

                    <TextItem label='Căn Cước Công Dân'>{dataDetail?.cccd}</TextItem>
                    <TextItem label='Quê Quán'>{dataDetail?.countryside}</TextItem>
                    <TextItem label='Số Phòng'>{dataDetail?.position}</TextItem>

                </Row>
                <h3 className={styles.titleList} >Đang quản lý những phạm nhân:</h3>
                <Table
                    columns={columns}
                    dataSource={dataDetail?.listPrisoner}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                />
            </div>

        </div>
    )
}

export default StaffDetail