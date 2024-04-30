import { Tag } from 'antd';
import React from 'react'
import styles from './StatusPunish.module.scss'

interface IStatusPunish {
    status?: boolean;
}

const StatusPunish = (props: IStatusPunish) => {
    const { status } = props
    return (
        <div>
            {status ? (
                <Tag
                    style={{
                        color: `#00a84e`,
                        backgroundColor: `#f5fff9`,
                        border: `1px solid #00a84e`,
                    }}
                >
                    Hiệu Lực
                </Tag>
            ) : (
                <Tag
                    style={{
                        color: `#d01b1b`,
                        backgroundColor: `#fff5f5`,
                        border: `1px solid #d01b1b`,
                    }}
                >
                    Tạm Ngưng
                </Tag>
            )}
        </div>
    )
}

export default StatusPunish