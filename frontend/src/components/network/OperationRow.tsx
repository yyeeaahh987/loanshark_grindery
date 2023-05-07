import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Menu } from "grindery-ui";
import { ICONS } from "../../constants";
import { useNavigate, useParams } from "react-router";
import useConnectorContext from "../../hooks/useConnectorContext";

const Row = styled.tr`
  border-bottom: 1px solid #dcdcdc;
  border-top: 1px solid #dcdcdc;

  & > td:first-child {
    padding-left: 10px;
  }
  & > td:last-child {
    padding-right: 10px;
  }

  &:hover {
    background: #f7f7f7;
  }
`;

const Column = styled.td`
  padding: 20px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;
  cursor: pointer;

  &:last-child {
    cursor: default;
    max-width: 30px;
  }
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  operation: any;
};

const OperationRow = (props: Props) => {
  const { operation } = props;
  let { id, type } = useParams();
  const { onOperationDelete } = useConnectorContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let navigate = useNavigate();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Row>
      <Column
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${operation.key}/settings`
          );
        }}
      >
        {operation.display?.label || operation.name || operation.key || ""}
      </Column>
      <Column
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${operation.key}/settings`
          );
        }}
      >
        {operation.key || ""}
      </Column>
      <Column
        style={{ width: "80px" }}
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${operation.key}/settings`
          );
        }}
      >
        {operation.display.featured ? "Yes" : "No"}
      </Column>
      <Column style={{ textAlign: "right", width: "30px" }}>
        <MenuButtonWrapper>
          <IconButton onClick={handleMenuOpen} icon={ICONS.DOTS_HORIZONTAL} />
        </MenuButtonWrapper>
        <Menu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          closeOnClick
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          items={[
            {
              key: "1",
              label: "Edit",
              onClick: () => {
                navigate(
                  `/network/connector/${id}/${type}/${operation.key}/settings`
                );
              },
            },
            {
              key: "2",
              label: "Delete",
              onClick: () => {
                onOperationDelete(type, operation.key);
              },
            },
          ]}
        />
      </Column>
    </Row>
  );
};

export default OperationRow;
