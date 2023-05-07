import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Menu, IconButton } from "grindery-ui";
import styled from "styled-components";
import { ICONS } from "../../constants";
import ConnectorContributor from "./ConnectorContributor";
import useNetworkContext from "../../hooks/useNetworkContext";
import Confirm from "./Confirm";

const Row = styled.tr`
  border: 1px solid #dcdcdc;

  & > td:first-child {
    padding-left: 20px;
  }
  & > td:last-child {
    padding-right: 20px;
    text-align: right;
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

  &:first-child {
    max-width: 30px;
  }

  &:last-child {
    cursor: default;
    max-width: 30px;
  }
`;

const Icon = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 8px;
  width: 40px;
  box-sizing: border-box;

  & img {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const ConnectorName = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  color: #141416;
  padding: 0;
  margin: 0;
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  connector: any;
};

const ConnectorRow = (props: Props) => {
  const { connector } = props;
  const { deleteConnector } = useNetworkContext();
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const cds = JSON.parse(connector?.values?.cds || "");
  const [confirm, setConfirm] = useState({
    message: "",
    opened: false,
    onClose: () => {},
    onConfirm: () => {},
  });

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloneClick = async () => {
    navigate(`/network/clone/${cds.key}?name=${encodeURIComponent(cds.name)}`);
  };

  const menuItems = [
    {
      key: "edit",
      label: "Edit",
      onClick: () => {
        navigate("/network/connector/" + cds.key);
      },
    },
    {
      key: "clone",
      label: "Clone",
      onClick: handleCloneClick,
    },
  ];

  if (connector?.values?.status?.name !== "Published") {
    menuItems.push({
      key: "delete",
      label: "Delete",
      onClick: () => {
        setConfirm({
          message: `Are you sure you want to delete ${cds.name} connector? You won't be able to restore it.`,
          opened: true,
          onClose: () => {
            setConfirm({
              message: "",
              opened: false,
              onClose: () => {},
              onConfirm: () => {},
            });
          },
          onConfirm: () => {
            deleteConnector(cds.key);
            setConfirm({
              message: "",
              opened: false,
              onClose: () => {},
              onConfirm: () => {},
            });
          },
        });
      },
    });
  }

  return (
    <Row key={cds.key}>
      <Column
        style={{ width: "40px" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        <Icon>
          <img src={cds?.icon || ICONS.NEXUS_SQUARE} alt="" />
        </Icon>
      </Column>
      <Column
        style={{ width: "30%" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        <ConnectorName>{cds?.name || cds.key}</ConnectorName>
      </Column>
      <Column style={{ textAlign: "right" }}>
        <ConnectorContributor contributor={connector.values?.contributor} />
      </Column>
      <Column
        style={{ textAlign: "right" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        {cds?.access || "Public"}
      </Column>
      <Column
        style={{ textAlign: "right" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        {connector.values?.status?.name === "Approved"
          ? "Published"
          : connector.values?.status?.name || ""}
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
          items={menuItems}
        />
        <Confirm state={confirm} />
      </Column>
    </Row>
  );
};

export default ConnectorRow;
