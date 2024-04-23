import Header from '../../Components/Header/Header'
import React, { useState } from 'react'
import styles from './Staff.module.scss'
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateStaff from './CreateStaff/CreateStaff';
import defaultImage from '../../assets/default.jpg'

const Staff = () => {
    const items = [
        {
            title: <div>Nhân Viên</div>
        },
        {
            title: <div>Danh Sách Nhân Viên</div>
        }
    ];
    const initialFieldValues = {
        imageName: "",
        imageSrc: defaultImage,
        imageFile: null,
    };

    const [openCreatePrisoner, setOpenCreatePrisoner] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false)
    const [reset, setReset] = useState<boolean>(false)
    const [values, setValues] = useState(initialFieldValues);
    const [showDelete, setShowDelete] = useState<boolean>(false);


    const handleOpenCreate = () => {
        setOpenCreatePrisoner(true);
        setIsEdit(false);
        setReset(!reset)
    };
    return (
        <div>

            <div>
                <Header items={items} />
            </div>

            <div className={styles.wrapperContent}>
                <div className={styles.wrapperBtn}>
                    <div className={"createBtn"} onClick={handleOpenCreate}>
                        <PlusCircleOutlined style={{ fontSize: 18 }} />
                        Tạo Nhân Viên
                    </div>
                    <div>search</div>
                </div>
                {/* <Table
                    columns={columns}
                    dataSource={dataPrisoner}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                /> */}
            </div>

            <CreateStaff
                openCreatePrisoner={openCreatePrisoner}
                setOpenCreatePrisoner={setOpenCreatePrisoner}
                isEdit={isEdit}
                // currentRecord={currentRecord}
                values={values}
                setValues={setValues}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                initialFieldValues={initialFieldValues}
                setRecall={setRecall}
                recall={recall}
                reset={reset}

            />
        </div>
    )
}

export default Staff