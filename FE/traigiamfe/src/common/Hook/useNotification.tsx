import { App, notification } from 'antd';
import styles from './useNotification.module.scss';
import { CheckCircleFilled, ExclamationCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons';
import { ArgsProps } from 'antd/es/notification/interface';

const useNotification = () => {
    const baseConfig: ArgsProps = {
        className: `${styles.tgNotification} ${styles.tgCustomNotification}`,
        icon: <CheckCircleFilled />,
        duration: 3,
        message: ''
    };

    const success = (message?: React.ReactNode, config?: Partial<ArgsProps>) => {
        const successConfig: ArgsProps = {
            ...baseConfig,
            icon: <CheckCircleFilled className="tg-notification-success" />
        };
        notification.success({ ...successConfig, message, ...config });

    };
    const info = (message?: React.ReactNode, config?: Partial<ArgsProps>) => {
        const infoConfig: ArgsProps = {
            ...baseConfig,
            icon: <InfoCircleFilled className="tg-notification-info" />,
            message: ''
        };

        notification.info({ ...infoConfig, message, ...config });
    };
    const error = (message?: React.ReactNode, config?: Partial<ArgsProps>) => {
        const errorConfig: ArgsProps = {
            ...baseConfig,
            icon: <ExclamationCircleFilled className="tg-notification-error" />
        };

        notification.error({ ...errorConfig, message, ...config });
    };
    const warning = (message?: React.ReactNode, config?: Partial<ArgsProps>) => {
        const warningConfig: ArgsProps = {
            ...baseConfig,
            icon: <WarningFilled className="tg-notification-warning" />
        };

        notification.warning({ ...warningConfig, message, ...config });
    };

    const openDefault = (config: ArgsProps) => {
        notification.open(config);
    };

    return { success, openDefault, error, warning, info };
};
export { useNotification };
