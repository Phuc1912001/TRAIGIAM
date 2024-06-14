import Search from "antd/es/input/Search";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Tab.module.scss";
const enum GenderEnum {
  male = 1,
  feMale = 2,
}

interface ITab {
  onSearch: (value: string) => void;
  setParam: (params: any) => void;
}

const Tab = (props: ITab) => {
  const { onSearch, setParam } = props;
  const [activeTab, setActiveTab] = useState(GenderEnum.male);
  const indicatorRef = useRef<any>(null);
  const tabRefs = useRef<any>({});

  useEffect(() => {
    const activeElement = tabRefs.current[activeTab];
    if (activeElement && indicatorRef.current) {
      indicatorRef.current.style.width = `${activeElement.offsetWidth}px`;
      indicatorRef.current.style.left = `${activeElement.offsetLeft}px`;
    }
  }, [activeTab]);

  const handleChangeTab = (gender: number) => {
    setActiveTab(gender);
    setParam({
      domGenderId: gender,
    });
  };

  return (
    <div>
      <div className={styles.wrapperHeaderContent}>
        <div className={styles.wrapperTab}>
          <div
            ref={(el) => (tabRefs.current[GenderEnum.male] = el)}
            onClick={() => handleChangeTab(GenderEnum.male)}
            className={activeTab === GenderEnum.male ? styles.tab : styles.item}
          >
            Nam
          </div>
          <div
            ref={(el) => (tabRefs.current[GenderEnum.feMale] = el)}
            onClick={() => handleChangeTab(GenderEnum.feMale)}
            className={
              activeTab === GenderEnum.feMale ? styles.tab : styles.item
            }
          >
            Nữ
          </div>
          <div ref={indicatorRef} className={styles.indicator}></div>
        </div>
        <div>
          <Search
            placeholder="tìm kiếm theo tên nhân viên"
            onSearch={onSearch}
            style={{ width: 250 }}
            size="large"
            allowClear
          />
        </div>
      </div>
      <div className={styles.customDivider}></div>
    </div>
  );
};

export default Tab;
