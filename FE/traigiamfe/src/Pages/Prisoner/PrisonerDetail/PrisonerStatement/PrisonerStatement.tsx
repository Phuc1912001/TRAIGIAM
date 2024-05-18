import { StatmentModel } from '@/common/Model/statement';
import { CloudUploadOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import StatusStatement from '../../../Statement/StatusStatement/StatusStatement';
import styles from './PrisonerStatement.module.scss';

interface IPrisonerStatement {
    dataStatement: StatmentModel[]
}

const PrisonerStatement = (props: IPrisonerStatement) => {

    const { dataStatement } = props;

    const handleToView = (record: StatmentModel) => {

    }

    const handleNavigate = (record: StatmentModel) => {

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

    ];
    return (
        <div>
            {
                dataStatement && dataStatement.length > 0 ? <Table
                    columns={columns}
                    dataSource={dataStatement}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                /> : <div className={styles.text}>
                    <CloudUploadOutlined />
                    <div>Không tồn tại lời khai.</div>
                </div>
            }

        </div>
    )
}

export default PrisonerStatement