import Header from '../../../Components/Header/Header'
import React from 'react'
import styles from './PrisonerDetail.module.scss'
import { useNavigate } from 'react-router-dom'
import avatar from '../../../assets/avatar.jpg'
import { Row } from 'antd'
import TextItem from '../../../Components/TextItem/TextItem'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'

const PrisonerDetail = () => {
    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/")
    }
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
    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className={styles.containerDetail} >
                <h2>Chi Tiết Phạm Nhân</h2>
                <div className={styles.wrapperInfor} >
                    <div>
                        <img className={styles.avatar} src={avatar} alt="" />
                    </div>
                    <div>
                        <h3>Nguyễn Văn A</h3>
                        <div className={styles.age} >18 tuổi</div>
                    </div>
                </div>
                <Row style={{ height: '100%' }}  >
                    <TextItem label='Mã Phạm Nhân' >PN1</TextItem>
                    <TextItem label='Giới Tính' >Nam</TextItem>
                    <TextItem label='Căn Cước Công Dân'>001201032276</TextItem>
                    <TextItem label='Quê Quán'>Mai Đình ,Sóc Sơn,Hà Nội</TextItem>
                    <TextItem label='Số Phòng'>5</TextItem>
                    <TextItem label='Số Giường'>1</TextItem>
                    <TextItem label='Tội Danh'>Trộm Cắp</TextItem>
                    <TextItem label='Số Năm'>5 năm</TextItem>
                    <TextItem label='Người Quản Lý'>Ma Giam</TextItem>
                </Row>
            </div>
        </div>
    )
}

export default PrisonerDetail