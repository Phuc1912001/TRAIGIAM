import React, { useState } from "react";
import styles from "./DetailStatement.module.scss";
import { Button, Drawer, Image, Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { StatmentModel } from "@/common/Model/statement";
import dayjs from "dayjs";
import TextItem from "../../../Components/TextItem/TextItem";

interface IDetailStatement {
  openStatement?: boolean;
  setOpenStatement?: React.Dispatch<React.SetStateAction<boolean>>;
  currentStatement?: StatmentModel;
}

const DetailStatement = (props: IDetailStatement) => {
  const { openStatement, setOpenStatement, currentStatement } = props;
  const [previewOpen, setPreviewOpen] = useState(false);

  const onClose = () => {
    setOpenStatement?.(false);
  };

  const footerOnlyView = (
    <div>
      <Button
        onClick={() => {
          onClose();
        }}
        style={{ minWidth: 80 }}
      >
        Đóng
      </Button>
    </div>
  );
  return (
    <div className={styles.wrapperDetail}>
      <Drawer
        title={"Chi tiết Lời Khai"}
        open={openStatement}
        placement="right"
        closable={false}
        rootClassName={styles.EditInfringement}
        extra={<CloseOutlined onClick={onClose} />}
        width={620}
        footer={footerOnlyView}
        destroyOnClose
        contentWrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
      >
        <div>
          <Row style={{ height: "100%" }}>
            <TextItem label="Tên Phạm Nhân">
              {currentStatement?.prisonerName}
            </TextItem>
            <TextItem label="Tên Vi Phạm">{currentStatement?.irName}</TextItem>
            <TextItem label="Ngày Khai  Báo">
              {dayjs(currentStatement?.timeStatement).format("DD-MM-YYYY")}
            </TextItem>
            <TextItem label="Tạo Bởi">
              {currentStatement?.createdByName}
            </TextItem>
            <TextItem label="Chấp Nhận Bởi">
              {currentStatement?.modifiedByName ?? "N/A"}
            </TextItem>
          </Row>
          <TextItem
            textItemProps={{ isCol: true, spanNumber: 24 }}
            label="Lời Khai"
          >
            {currentStatement?.statement}
          </TextItem>

          <TextItem
            textItemProps={{ isCol: true, spanNumber: 24 }}
            label="Hình ảnh liên quan"
          >
            <div className={styles.imageChoose}>
              <Image
                rootClassName={styles.images}
                preview={{
                  visible: previewOpen,
                  movable: false,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={currentStatement?.imageSrc}
              />
            </div>
          </TextItem>
        </div>
      </Drawer>
    </div>
  );
};

export default DetailStatement;
