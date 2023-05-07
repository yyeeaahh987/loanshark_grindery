import React, { useState } from "react";
import styled from "styled-components";
import { Menu, Text, IconButton } from "grindery-ui";
import DataBox from "./DataBox";
import { ICONS, isLocalOrStaging } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import { useNavigate } from "react-router";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";

const AppTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  color: var(--color-black);
`;

const AppIconWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
`;

const AppIcon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const AppCountersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const AppCounter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const AppCounterValue = styled.span`
  font-weight: 700;
  line-height: 1.25;
  font-size: 12px;
  display: block;
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const AppType = styled.span`
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 120%;
  letter-spacing: 0.03333em;
  color: rgb(117, 135, 150);
`;

type Props = {
  item: any;
  showWorkflows?: boolean;
  showMenu?: boolean;
  onClick?: () => void;
};

const AppRow = (props: Props) => {
  const { user } = useAppContext();
  const { workspace } = useWorkspaceContext();
  const { item, showWorkflows, showMenu, onClick } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let navigate = useNavigate();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const menuItems = [
    {
      key: "clone",
      label: "Clone connector",
      onClick: () => {
        window.open(
          `https://network${
            isLocalOrStaging ? "-staging" : ""
          }.grindery.org/clone/${
            item.key
          }?source=nexus&name=${encodeURIComponent(item.name)}`,
          "_blank"
        );
      },
    },
  ];

  if (
    item.access &&
    ((item.access === "Private" && item.user === user) ||
      (item.access === "Workspace" && item.workspace === workspace))
  ) {
    menuItems.push({
      key: "edit",
      label: "Edit connector",
      onClick: () => {
        window.open(
          `https://network${
            isLocalOrStaging ? "-staging" : ""
          }.grindery.org/connector/${item.key}`,
          "_blank"
        );
      },
    });
  }

  return (
    <>
      <DataBox
        key={item.key}
        size="small"
        LeftComponent={
          <AppTitleWrapper
            onClick={onClick ? onClick : undefined}
            style={{ cursor: onClick ? "pointer" : "default" }}
          >
            <AppIconWrapper>
              <AppIcon src={item.icon} alt={item.name} />
            </AppIconWrapper>
            <div>
              <Title>{item.name}</Title>
              <AppType>
                {item.access ? (
                  <>
                    {item.access === "Public" && "Public"}
                    {item.access === "Workspace" && "Private for workspace"}
                    {item.access === "Private" && "Private"}
                  </>
                ) : (
                  "Public"
                )}
              </AppType>
            </div>
          </AppTitleWrapper>
        }
        RightComponent={
          <RightWrapper>
            {showWorkflows && (
              <AppCountersWrapper>
                <AppCounter>
                  <AppCounterValue>{item.workflows.toString()}</AppCounterValue>
                  <span style={{ color: "#758796", height: "17px" }}>
                    <Text variant="caption" value="Workflows" />
                  </span>
                </AppCounter>
              </AppCountersWrapper>
            )}
            {showMenu && item.type && item.type === "web3" && (
              <>
                <MenuButtonWrapper>
                  <IconButton
                    onClick={handleMenuOpen}
                    icon={ICONS.DOTS_HORIZONTAL}
                  />
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
              </>
            )}
          </RightWrapper>
        }
      />
    </>
  );
};

export default AppRow;
