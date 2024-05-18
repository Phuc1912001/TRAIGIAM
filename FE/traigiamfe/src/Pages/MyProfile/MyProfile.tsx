import { EditOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import avatar from '../../assets/avatar.jpg';
import Header from '../../Components/Header/Header';
import TextItem from '../../Components/TextItem/TextItem';
import styles from './MyProfile.module.scss';

const MyProfile = () => {
    const items = [
        {
            title: <div>Thông Tin Cá Nhân</div>,
        },

    ];
    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className={styles.containerProfile}>
                <h2>Thông Tin Cá Nhân</h2>
                <div className={styles.containerInfor} >
                    <div className={styles.wrapperInfo} >
                        <div>
                            <img className={styles.avatar} src={avatar} alt="" />
                        </div>
                        <div>
                            <h3 >Nguyễn Văn A</h3>
                            <div className={styles.admin} >
                                Vai Trò: Quản trị viên
                            </div>
                        </div>
                    </div>
                    <div className={styles.btnEdit} >
                        <EditOutlined style={{ fontSize: 18 }} />
                        <div>Edit</div>
                    </div>
                </div>
                <Row style={{ height: '100%' }}  >
                    <TextItem label='Email' >nguyenvanphuc1912001@gmail.com</TextItem>
                    <TextItem label='Số Điện Thoại' >0329609726</TextItem>
                    <TextItem label='Quê Quán' >  Mai Đình Sóc Sơn Hà Nội </TextItem>
                </Row>
            </div>
        </div>
    )
}

export default MyProfile