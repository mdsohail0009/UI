import * as React from 'react';
import { GridColumnMenuFilter } from '@progress/kendo-react-grid';
export const ColumnMenu = props => {
  return <div>
        <GridColumnMenuFilter {...props} expanded={true} />
      </div>;
};
