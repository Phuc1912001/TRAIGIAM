import { useLoading } from '../../../common/Hook/useLoading'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './StaffDetail.module.scss'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import axios from 'axios'
import { StaffModelDetail } from '@/common/Model/staff'
import { Row } from 'antd'
import TextItem from '../../../Components/TextItem/TextItem'

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
                <Row style={{ height: '100%' }}  >
                    <TextItem label='Mã Phạm Nhân' >{dataDetail?.mnv}</TextItem>

                    <TextItem label='Căn Cước Công Dân'>{dataDetail?.cccd}</TextItem>
                    <TextItem label='Quê Quán'>{dataDetail?.countryside}</TextItem>
                    <TextItem label='Số Phòng'>{dataDetail?.position}</TextItem>

                </Row>
            </div>
        </div>
    )
}

export default StaffDetail