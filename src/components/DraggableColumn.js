import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableColumn = ({ id, index, moveColumn, children, ...rest }) => {
  const [, ref] = useDrag({
    type: 'COLUMN',
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: (item) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <th ref={(node) => ref(drop(node))} {...rest}>
      {children}
    </th>
  );
};

export default DraggableColumn;
