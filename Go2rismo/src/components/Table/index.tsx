/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, TableProps } from 'antd';
import { type ColumnType, type ColumnGroupType } from 'antd/es/table';
import clsx from 'clsx';

interface ITableProps extends TableProps<any>{
  loading?: boolean;
  classes?: any;
  datasource?: any[];
  name?: any;
  rowSelection?: any;
  rowClassName?: (record: any, index: number) => string; // Include rowClassName in ITableProps
  columns: Array<ColumnType<any>> | Array<ColumnGroupType<any>>;
}
function CustomTable(props: ITableProps) {
    console.log(props)
  return (
    <Table
      columns={props.columns}
      className={clsx(props.className, props.classes)}
      loading={props.loading}
      dataSource={props.datasource}
      rowSelection={props.rowSelection}
      rowClassName={props.rowClassName} // Apply rowClassName
      
      scroll={{
        x: '00vw',
      }}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ['5', '20', '30'],
      }}
    />
  );
}
export default CustomTable;
