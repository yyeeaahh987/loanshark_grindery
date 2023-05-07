import React from "react";
import styled from "styled-components";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";
import { useNavigate, useParams } from "react-router";
import OperationInputFieldRow from "./OperationInputFieldRow";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  max-width: 100%;
`;

const TableHeader = styled.thead`
  & > tr > th {
    text-align: left;
  }
`;

const TableHeaderColumn = styled.th`
  padding: 15px 10px;
  font-weight: 400;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
  text-align: right;
  margin: 20px 0;

  & button {
    padding: 8px 24px;
    font-size: 14px;
  }
`;

type Props = {};

const OperationInputFields = (props: Props) => {
  let { id, type, key } = useParams();
  let navigate = useNavigate();
  const { state } = useConnectorContext();

  const inputFields: any[] =
    (type &&
      (state.cds?.[type] || []).find((op: any) => op.key === key)?.operation
        ?.inputFields) ||
    [];

  return (
    <>
      {inputFields && inputFields.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderColumn>Label</TableHeaderColumn>
                <TableHeaderColumn>Key</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </tr>
            </TableHeader>
            <tbody>
              {inputFields.map((inputField: any) => (
                <OperationInputFieldRow
                  inputKey={inputField.key}
                  key={inputField.key}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <ButtonWrapper>
        <Button
          onClick={() => {
            navigate(
              `/network/connector/${id}/${type}/${key}/inputFields/__new__`
            );
          }}
        >
          Add User Input Field
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default OperationInputFields;
