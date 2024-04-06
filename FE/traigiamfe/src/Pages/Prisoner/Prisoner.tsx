import Header from "../../Components/Header/Header";
import { Breadcrumb } from "antd";
import React from "react";
import styles from "./Prisoner.module.scss";
const Prisoner = () => {
    const items = [
        {
            title: <div>Phạm Nhân</div>
        },
        {
            title: <div>Danh Sách Phạm Nhân</div>
        }
    ];
    return (
        <div>
            <div>
                <Header items={items} />
            </div>
            <div>Prisoner</div>
        </div>
    );
};

export default Prisoner;
