import React from "react";
import _ from "lodash";
import { Navigate, useNavigate, useParams } from "react-router";
import styled from "styled-components";
import useConnectorContext from "../../../hooks/useConnectorContext";
import Button from "../../network/Button";
import OperationRow from "../../network/OperationRow";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

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
  margin: 30px 0 20px;

  & button {
    padding: 8px 24px;
    font-size: 14px;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const CardContent = styled.div`
  width: 100%;
`;

const CardTitle = styled.h5`
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
  padding: 0;
  color: #0b0d17;
`;

const CardDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 10px 0 0;
  padding: 0;
  color: #898989;
`;

type Props = {};

const ConnectorOperationsPage = (props: Props) => {
  const { state } = useConnectorContext();
  let { id, type } = useParams();
  let navigate = useNavigate();
  const { cds } = state;

  const title = type === "triggers" ? "Triggers" : "Actions";

  if (type !== "actions" && type !== "triggers") {
    return <Navigate to={`/network/connector/${id}`} replace />;
  }

  return (
    <div>
      <Title>{title}</Title>
      <div>
        {cds?.[type] && cds?.[type].length > 0 && (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderColumn>Label</TableHeaderColumn>
                <TableHeaderColumn>Key</TableHeaderColumn>
                <TableHeaderColumn>Featured</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </tr>
            </TableHeader>
            <tbody>
              {[
                ..._.orderBy(
                  (cds?.[type] || []).filter((op: any) => op.display.featured),
                  [(op: any) => op.display.label?.toLowerCase()],
                  ["asc"]
                ),
                ..._.orderBy(
                  (cds?.[type] || []).filter((op: any) => !op.display.featured),
                  [(op: any) => op.display.label?.toLowerCase()],
                  ["asc"]
                ),
              ].map((op: any) => (
                <OperationRow operation={op} key={op.key} />
              ))}
            </tbody>
          </Table>
        )}
      </div>
      {(!cds?.[type] || cds?.[type].length < 1) && (
        <Card>
          <CardContent>
            <CardTitle>
              Add your first {type === "triggers" ? "trigger" : "action"}
            </CardTitle>
            <CardDescription>
              {type === "triggers"
                ? "Help users to catch new data as soon as it is available. Triggers listen to smart-contract events."
                : "Help users to call functions. Actions send transactions to the smart-contract."}
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <ButtonWrapper>
        <Button
          onClick={() => {
            navigate(`/network/connector/${id}/${type}/__new__`);
          }}
        >
          Add {type === "triggers" ? "Trigger" : "Action"}
        </Button>
      </ButtonWrapper>
    </div>
  );
};

export default ConnectorOperationsPage;
