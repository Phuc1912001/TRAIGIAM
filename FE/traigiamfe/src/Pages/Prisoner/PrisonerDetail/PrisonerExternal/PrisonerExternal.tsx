import { CheckInCheckOutModel } from '@/common/Model/checkincheckout';
import { CloudUploadOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import StatusExternal from '../../../CheckInCheckOut/StatusExternal/StatusExternal';
import styles from './PrisonerExternal.module.scss';

interface IPrisonerExternal {
    dataExternal?: CheckInCheckOutModel[]
}


const PrisonerExternal = (props: IPrisonerExternal) => {

    const { dataExternal } = props

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

    const handleToViewExternal = (record: CheckInCheckOutModel) => {

    }


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
            {
                dataExternal && dataExternal?.length > 0 ?
                    <Table
                        columns={columns}
                        dataSource={dataExternal}
                        className={`${styles.prisonerTable} share-border-table`}
                        tableLayout="auto"
                    /> : <div className={styles.text}>
                        <CloudUploadOutlined />
                        <div>Không tồn tại lịch sử ra vào.</div>
                    </div>
            }

        </div>
    )
}

export default PrisonerExternal