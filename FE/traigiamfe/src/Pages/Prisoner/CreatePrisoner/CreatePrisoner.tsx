import { CloseOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import React from 'react'
import styles from './CreatePrisoner.module.scss'



interface ICreatePrisoner {
    openCreatePrisoner: boolean;
    setOpenCreatePrisoner: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean
}

const CreatePrisoner = (props: ICreatePrisoner) => {
    const { openCreatePrisoner, setOpenCreatePrisoner, isEdit } = props

    const onClose = () => {
        setOpenCreatePrisoner(false)

    };


    const filterDrawFooterView = (
        <div className={styles.wrapperBtn} >
            <Button
                onClick={() => {
                    onClose();
                }}

                style={{ minWidth: 80 }}
            >
                Đóng
            </Button>
            <div
                onClick={() => {
                    // onClose();
                }}
                className='btn-orange'
            >
                Tạo Phạm Nhân
            </div>

        </div>
    );

    const filterDrawFooter = (
        <div className={styles.wrapperBtn} >
            <Button
                onClick={() => {
                    onClose();
                }}

                style={{ minWidth: 80 }}
            >
                Đóng
            </Button>
            <div
                onClick={() => {
                    // onClose();
                }}
                className='btn-orange'
            >
                Sửa Phạm Nhân
            </div>

        </div>
    );
    return (
        <div>
            <Drawer
                title={isEdit ? 'Sửa Phạm Nhân' : 'Tạo Phạm Nhân'}
                open={openCreatePrisoner}
                placement="right"
                closable={false}
                rootClassName={styles.EditInfringement}
                extra={<CloseOutlined onClick={onClose} />}
                width={620}
                footer={isEdit ? filterDrawFooter : filterDrawFooterView}
                destroyOnClose
                contentWrapperStyle={{ maxWidth: 'calc(100vw - 32px)' }}
            >

            </Drawer>
        </div>
    )
}

export default CreatePrisoner