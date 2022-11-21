import React from "react";
import { highlighIndexs } from '../../App';
import { TableDatatype } from "../../types"

const TableData = ({ column, data, row }: TableDatatype) => {
  const highlightWords = () => {
    if (!JSON.stringify(highlighIndexs).includes(JSON.stringify([row, column])))
      return false;

    return true;
  }

  return (<>
    <td style={{ background: highlightWords() ? "lightgreen" : "white" }}>
      {data}
    </td>
  </>)

};

export { TableData };
