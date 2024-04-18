import { Col } from 'antd';
import styles from './TextItem.module.scss';
export interface IProps {
    label?: string;
    children?: any;
    textItemProps?: ITextItemProps;
    className?: string;
    greyedOut?: boolean;
    style?: React.CSSProperties;
}

export interface ITextItemProps {
    isCol?: boolean;
    spanNumber?: number;
    spanMobNumber?: number;
}

export default function TextItem(props: IProps) {
    const { label, children, className, textItemProps = {}, greyedOut } = props;
    const { isCol = true, spanMobNumber = 24, spanNumber = 12 } = textItemProps;

    return isCol ? (
        <Col
            className={`${styles.hcisComptReporttextitem} ipadMiniResponsive ${className ?? ''} `}
            xs={spanMobNumber}
            md={spanNumber}
        >
            <div className={`hcis-compt-reporttextitem-label ${greyedOut && styles.greyedOutLabel}`} style={props.style}>
                {label}
            </div>
            <div className={`hcis-compt-reporttextitem-text ${greyedOut ? styles.greyedOutText : ''}`}>{children}</div>
        </Col>
    ) : (
        <div className={`${styles.hcisComptReporttextitem} ${className ?? ''}`}>
            <div className={`hcis-compt-reporttextitem-label ${greyedOut ? styles.greyedOutLabel : ''}`} style={props.style}>
                {label}
            </div>
            <div className={`hcis-compt-reporttextitem-text ${greyedOut ? styles.greyedOutText : ''}`}>{children}</div>
        </div>
    );
}