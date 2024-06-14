import { InfoCircleFilled } from "@ant-design/icons";
import { Divider, Modal } from "antd";
import React from "react";
import styles from "./ModalComponent.module.scss";

interface IModalComponent {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete?: () => void;
  children: React.ReactNode;
  title: any;
  textConfirm: any;
}

const ModalComponent = (props: IModalComponent) => {
  const {
    isOpenModal,
    setIsOpenModal,
    handleDelete,
    children,
    title,
    textConfirm,
  } = props;
  const handleCancel = () => {
    setIsOpenModal(false);
  };

  return (
    <Modal
      okText={textConfirm}
      cancelText={"Hủy"}
      visible={isOpenModal}
      onOk={handleDelete}
      onCancel={handleCancel}
      title={
        <div className={styles.titleModel}>
          <InfoCircleFilled className={styles.infoIcon} />
          <div>{title}</div>
        </div>
      }
      width={400}
      wrapClassName={styles.containerModel}
      destroyOnClose
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
