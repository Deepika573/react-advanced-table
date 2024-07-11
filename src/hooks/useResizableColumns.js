import { useEffect, useState } from 'react';

const useResizableColumns = (columns) => {
  const [resizableColumns, setResizableColumns] = useState(columns);

  useEffect(() => {
    setResizableColumns(
      columns.map((col) => ({
        ...col,
        width: col.width || 150,
      }))
    );
  }, [columns]);

  const handleResize = (index, newWidth) => {
    setResizableColumns((cols) =>
      cols.map((col, i) => (i === index ? { ...col, width: newWidth } : col))
    );
  };

  return { resizableColumns, handleResize };
};

export default useResizableColumns;
