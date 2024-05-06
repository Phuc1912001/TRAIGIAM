import { Tag } from 'antd'
import React from 'react'
interface IStatusInfringement {
    status?: number;
}

const StatusInfringement = (props: IStatusInfringement) => {
    const { status } = props
    const renderStatus = (status: number) => {
        switch (status) {
            case 0:
                return (
                    <Tag
                        style={{
                            color: `#006ac2`,
                            backgroundColor: `#e8f5ff`,
                            border: `1px solid #006ac2`,
                        }}
                    >
                        Chờ Quản Lý
                    </Tag>
                )
            case 1:
                return (
                    <Tag
                        style={{
                            color: `#006ac2`,
                            backgroundColor: `#e8f5ff`,
                            border: `1px solid #006ac2`,
                        }}
                    >
                        Chờ Giám Đốc
                    </Tag>
                )
            case 1:
                return (
                    <Tag
                        style={{
                            color: `#00a84e`,
                            backgroundColor: `#f5fff9`,
                            border: `1px solid #00a84e`,
                        }}
                    >
                        Hoàn Thành
                    </Tag>
                )
            default:
                break;
        }
    }
    return (
        <div>{renderStatus(status ?? 0)}</div>

    )
}

export default StatusInfringement