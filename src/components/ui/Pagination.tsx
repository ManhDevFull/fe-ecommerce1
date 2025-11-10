import { PaginationInfo } from "@/types/type";
import React from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';

const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log(current, pageSize);
};
type pageProps = {
    pageprops: PaginationInfo;
    totablPgae: number;
    onChangePage: (page: number, size: number) => void; 
}
export function PageFilter({pageprops, totablPgae, onChangePage} : pageProps) {
    return (
        <>
            <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                current={pageprops.pageNumber}
                total={totablPgae}
                pageSize={pageprops.pageSize}
                onChange={onChangePage} // tự động truyền page và size ở thời điểm click
            />
            <br />
        </>
    )
}