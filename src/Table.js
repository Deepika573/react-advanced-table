import React, { useMemo, useState, useCallback } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters } from 'react-table';
import mockData from './mockData';
import useResizableColumns from './hooks/useResizableColumns';
import DraggableColumn from './components/DraggableColumn';
import { DndProviderWrapper } from './DndContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div className="global-filter">
      <label htmlFor="global-search">Global Search:</label>
      <input
        id="global-search"
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Type to search across all columns..."
      />
    </div>
  );
};

const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;

  return (
    <div className="column-filter">
      <input
        value={filterValue || ''}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={`Filter ${column.Header}`}
      />
    </div>
  );
};

const Resizer = ({ onResize, index }) => {
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = e.target.parentElement.offsetWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      onResize(index, newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return <div className="resizer" onMouseDown={handleMouseDown} />;
};

const Table = () => {
  const data = useMemo(() => mockData, []);
  const initialColumns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Age', accessor: 'age' },
      { Header: 'Registration Date', accessor: 'registrationDate' },
    ],
    []
  );

  const [columns, setColumns] = useState(initialColumns);
  const { resizableColumns, handleResize } = useResizableColumns(columns);

  const moveColumn = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedColumn = resizableColumns[dragIndex];
      const newColumns = [...resizableColumns];
      newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      setColumns(newColumns);
    },
    [resizableColumns]
  );

  const tableInstance = useTable(
    { columns: resizableColumns, data },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  return (
    <DndProviderWrapper>
      <div className="table-container">
        <GlobalFilter globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <DraggableColumn
                    key={column.id}
                    id={column.id}
                    index={index}
                    moveColumn={moveColumn}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div className="column-header">
                      {column.render('Header')}
                      <ColumnFilter column={column} />
                      <span
                        className="sort-icon"
                        onClick={() => column.toggleSortBy(!column.isSortedDesc)}
                      >
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          )
                        ) : (
                          <FontAwesomeIcon icon={faArrowUp} />
                        )}
                      </span>
                    </div>
                    <Resizer onResize={handleResize} index={index} />
                  </DraggableColumn>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td key={cell.column.id} {...cell.getCellProps()} style={{ width: cell.column.width }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DndProviderWrapper>
  );
};

export default Table;
