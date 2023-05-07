import React, { useState } from "react";
import styled from "styled-components";
import { Tabs } from "grindery-ui";
import {
  isLocalOrStaging,
  NOT_READY_ACTIONS,
  NOT_READY_TRIGGERS,
  SCREEN,
} from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import AppRow from "../shared/AppRow";
import Button from "../shared/Button";

const RootWrapper = styled.div`
  max-width: calc(100vw - 60px);
  @media (min-width: ${SCREEN.TABLET}) {
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
    max-width: auto;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    margin: 40px 20px 0;
  }
`;

const TabsWrapper = styled.div`
  & .MuiTab-root {
    text-transform: initial;
    font-weight: 400;
    font-size: var(--text-size-horizontal-tab-label);
    line-height: 150%;

    @media (min-width: ${SCREEN.TABLET}) {
      min-width: 150px;
    }
  }
`;

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px;
  }

  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 60px 106px;
  }
`;

/*const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 5px;

  .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    .MuiIconButton-root {
      margin-left: auto;
    }
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;

  & .MuiBox-root {
    margin-bottom: 0;
  }
  & .MuiOutlinedInput-root {
    margin-top: 0;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    flex: 0.5;
  }
`;*/

const AppsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;

  & button {
    margin: 0;
    font-size: 14px;
    padding: 8px 24px !important;
  }
`;

type Props = {};

const AppsPage = (props: Props) => {
  const { apps, connectors } = useAppContext();
  const items = apps;
  const searchTerm = "";
  let navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { size } = useWindowSize();

  const filteredItems = items.filter(
    (item) =>
      item &&
      item.name &&
      item.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  /*const handleSearchChange = (e: string) => {
    setSearchTerm(e);
  };*/

  const allConnectors = connectors
    .filter(
      (connector: any) =>
        !NOT_READY_TRIGGERS.find(
          (notReadyKey) => notReadyKey && notReadyKey === connector.key
        )
    )
    .filter(
      (connector: any) =>
        !NOT_READY_ACTIONS.find(
          (notReadyKey) => notReadyKey && notReadyKey === connector.key
        )
    );

  return (
    <RootWrapper>
      <TabsWrapper>
        <Tabs
          value={tab}
          onChange={(index: number) => {
            setTab(index);
          }}
          options={["Used", "Public", "Private", "All"]}
          orientation="horizontal"
          activeIndicatorColor="#A963EF"
          activeColor="#8C30F5"
          type="text"
          tabColor=""
          variant={size === "phone" ? "fullWidth" : ""}
        />
      </TabsWrapper>
      <Wrapper>
        {/*<SearchWrapper>
          <SearchInputWrapper>
            <TextInput
              placeholder={"(d)Apps"}
              value={searchTerm}
              onChange={handleSearchChange}
              type="search"
              icon="search"
            />
          </SearchInputWrapper>
        </SearchWrapper>*/}
        <AppsWrapper>
          {tab === 0 && (
            <>
              {filteredItems.map((item) => (
                <AppRow
                  item={item}
                  key={item.key}
                  onClick={() => {
                    navigate("/workflows?search=" + item.name);
                  }}
                  showWorkflows
                  showMenu
                />
              ))}
            </>
          )}
          {tab === 1 && (
            <>
              {allConnectors
                .filter((item) => !item.access || item.access === "Public")
                .map((item) => (
                  <AppRow item={item} key={item.key} showMenu />
                ))}
            </>
          )}
          {tab === 2 && (
            <>
              {allConnectors
                .filter((item) => item.access && item.access === "Private")
                .map((item) => (
                  <AppRow item={item} key={item.key} showMenu />
                ))}
            </>
          )}
          {tab === 3 && (
            <>
              {allConnectors.map((item) => (
                <AppRow item={item} key={item.key} showMenu />
              ))}
            </>
          )}
        </AppsWrapper>
        <ButtonsWrapper>
          <Button
            value="Create New Connector"
            onClick={() => {
              window.open(
                `https://network${
                  isLocalOrStaging ? "-staging" : ""
                }.grindery.org/connector/__new__`,
                "_blank"
              );
            }}
            variant="outlined"
            color="primary"
          />
        </ButtonsWrapper>
      </Wrapper>
    </RootWrapper>
  );
};

export default AppsPage;
