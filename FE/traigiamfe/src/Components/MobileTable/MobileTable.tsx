/********************************************************************
 *
 *  PROPRIETARY and CONFIDENTIAL
 *
 *  This file is licensed from, and is a trade secret of:
 *
 *                   AvePoint, Inc.
 *                   525 Washington Blvd, Suite 1400
 *                   Jersey City, NJ 07310
 *                   United States of America
 *                   Telephone: +1-201-793-1111
 *                   WWW: www.avepoint.com
 *
 *  Refer to your License Agreement for restrictions on use,
 *  duplication, or disclosure.
 *
 *  RESTRICTED RIGHTS LEGEND
 *
 *  Use, duplication, or disclosure by the Government is
 *  subject to restrictions as set forth in subdivision
 *  (c)(1)(ii) of the Rights in Technical Data and Computer
 *  Software clause at DFARS 252.227-7013 (Oct. 1988) and
 *  FAR 52.227-19 (C) (June 1987).
 *
 *  Copyright © 2024 AvePoint® Inc. All Rights Reserved.
 *
 *  Unpublished - All rights reserved under the copyright laws of the United States.
 */
import React, { useMemo } from 'react';
import { Checkbox, Pagination } from 'antd';
import styles from './MobileTable.module.scss';
import { TRCMobileTableProps } from './MobileTable.type';
import { SmileOutlined } from '@ant-design/icons';
import MobileTableHeader from './components/MobileTableHeader';
import MobileTableBody from './components/MobileTableBody';
import { useUtils } from '@/common/utils';

const MobileTable = <T,>({
    selection,
    tableSections,
    pagination,
    tableClassName,
    renderEmpty,
    getRowId,
    renderExtraActions,
    expand,
    data = [],
    itemsPerRow = 2
}: TRCMobileTableProps<T>) => {
    const { enabled, setSelectedRows, getCheckBoxDisabled, selectAll, selectedRows = [] } = selection;
    const { header, sections } = tableSections;
    const { combineClassNames } = useUtils();

    const validData = useMemo(() => {
        return data.filter((item) => {
            if (getCheckBoxDisabled) return !getCheckBoxDisabled(item);
            return true;
        });
    }, [data, getCheckBoxDisabled]);

    const renderSelectAllSection = () => {
        return (
            (renderExtraActions || selectAll?.show) && (
                <div className="hcis-mb-16 hcis-flex hcis-items-center">
                    {selectAll?.show && validData.length > 0 && (
                        <Checkbox
                            checked={validData.length === selectedRows.length}
                            indeterminate={selectedRows.length > 0 && selectedRows.length < validData.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedRows?.(validData.map((record) => getRowId(record)));
                                } else setSelectedRows?.([]);
                            }}
                            className="hcis-ml-16 hcis-flex-1"
                        >
                            <div>{selectAll.label ?? 'Select All'}</div>
                        </Checkbox>
                    )}
                    <div>{renderExtraActions?.()}</div>
                </div>
            )
        );
    };

    const renderNoRecord = () => {
        return renderEmpty ? (
            <>{renderEmpty()}</>
        ) : (
            <div className="hcis-d-flexcenter">
                <SmileOutlined style={{ marginRight: 5, color: '#4b5566' }} />
                <span style={{ color: '#4b5566' }}>There are no records to display.</span>
            </div>
        );
    };

    return data.length > 0 ? (
        <div className={tableClassName}>
            {renderSelectAllSection()}
            <Checkbox.Group
                value={selectedRows}
                onChange={(values) => {
                    setSelectedRows?.(values);
                }}
                className={combineClassNames('hcis-w100', pagination && 'hcis-mb-24')}
            >
                <div className="hcis-d-flex-col hcis-gap-16 hcis-w100">
                    {data.map((record) => (
                        <div key={getRowId(record) ?? Date.now()} className={styles.mobileCardWrapper}>
                            <MobileTableHeader
                                getCheckBoxDisabled={getCheckBoxDisabled}
                                getRowId={getRowId}
                                header={header}
                                enabled={enabled}
                                record={record}
                            />
                            <MobileTableBody itemsPerRow={itemsPerRow} expand={expand} record={record} sections={sections} />
                        </div>
                    ))}
                </div>
            </Checkbox.Group>
            {pagination && (
                <div className={styles.mobileTablePagination}>
                    <Pagination {...pagination} />
                </div>
            )}
        </div>
    ) : (
        renderNoRecord()
    );
};

export default MobileTable;
