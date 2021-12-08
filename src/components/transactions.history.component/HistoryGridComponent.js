import React, { Component } from 'react';
import List from "../grid.component";


class HistoryGridComponent extends Component {
 
  render() {
    return (
      <>
        <List url={this.props.gridUrl} additionalParams={this.props.params} ref={this.gridRef}
          key={this.props.gridUrl}
          columns={this.props.columns} />
      </>
    );
  }
}

export default HistoryGridComponent