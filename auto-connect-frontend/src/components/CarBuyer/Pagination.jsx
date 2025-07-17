import React from 'react';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  return (
    <div className={`tw:flex tw:justify-center tw:items-center tw:py-8 ${className}`}>
      <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:px-6 tw:py-4 tw:border tw:border-gray-100">
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={onPageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
                borderRadius: '12px',
                margin: '0 2px',
                minWidth: '40px',
                height: '40px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Pagination;
