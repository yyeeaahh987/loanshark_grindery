import React, { useState } from "react";
import styled from "styled-components";
import { Autocomplete } from "grindery-ui";
import Button from "./Button";
import useSignInContext from "../../hooks/useSignInContext";
import Jdenticon from "react-jdenticon";
import { Workspace } from "../../context/WorkspaceContext";
import { ICONS } from "../../constants";
import Foco from "react-foco";

const Container = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const Selector = styled.button`
  font-family: Roboto;
  background: none;
  box-shadow: none;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #eee0fd;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  width: 100%;

  &:hover,
  &.opened {
    border-color: #0b0d17 !important;
  }

  &.dark:hover,
  &.dark.opened {
    border-color: #ffffff !important;
  }
`;
const Text = styled.div`
  text-align: left;
`;

const Name = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 103%;
  color: #0b0d17;
  margin: 0 0 2px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.dark {
    color: #ffffff;
  }
`;

const Role = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #979797;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const Dropdown = styled.div`
  font-family: Roboto;
  position: absolute;
  left: 0;
  top: 100%;
  padding-top: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  transform: translateY(-10px);
  z-index: 99;
  width: 100%;

  &.opened {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
  }
`;

const DropdownContent = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 10px;
  max-height: 350px;
  overflow: auto;
`;

const DropdownItem = styled.button`
  background: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  border-radius: 5px;
  border: none;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  width: 100%;
  max-width: 100%;

  .avatar {
    background: #f4f5f7;
    padding: 2px;
    border-radius: 50%;
    box-sizing: border-box;
    width: 20px;
    height: 20px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &:hover,
  &:focus {
    background: #fdfbff;
    border: none;
  }

  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;
    white-space: nowrap;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & .edit-item {
    margin-left: auto;
    opacity: 0;
    visibility: hidden;
    width: 16px;
    height: 16px;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover .edit-item {
    opacity: 1;
    visibility: visible;
  }
`;

const Wrapper = styled.div`
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`;

const FormWrapper = styled.div`
  padding: 30px;
  background: #ffffff;
`;

const FormContent = styled.div`
  max-width: 740px;
  margin: 0 auto;
  color: #000000;
`;

const getUserRole = (workspace: Workspace | null, user: string) => {
  if (workspace?.creator === user) {
    return "admin";
  }
  if (workspace?.admins?.includes(user)) {
    return "admin";
  }
  if (workspace?.users?.includes(user)) {
    return "member";
  }
  return "";
};

type Props = {};

const WorkspaceSelectorMini = (props: Props) => {
  const {
    user,
    workspaces,
    workspace,
    setWorkspace,
    authCodeLoading,
    setWorkspaceSelected,
  } = useSignInContext();
  const [selectorOpened, setSelectorOpened] = useState(false);

  const handleSelectorClick = () => {
    setSelectorOpened(!selectorOpened);
  };
  return (
    <Wrapper>
      <FormWrapper>
        <FormContent>
          <Foco
            onClickOutside={() => {
              setSelectorOpened(false);
            }}
            onFocusOutside={() => {
              setSelectorOpened(false);
            }}
          >
            <Container>
              <Selector
                onClick={handleSelectorClick}
                className={`${selectorOpened ? "opened" : ""} light`}
              >
                <Text>
                  <Name className="light">
                    {workspace ? workspace.title : "Select workspace"}
                  </Name>
                  {workspace && (
                    <Role>{getUserRole(workspace, user) || "admin"}</Role>
                  )}
                </Text>
                <Icon
                  style={{ marginLeft: "auto" }}
                  src={ICONS.CARET_DOWN}
                  alt=""
                />
              </Selector>
              <Dropdown className={selectorOpened ? "opened" : ""}>
                <DropdownContent>
                  {workspaces.map((item: Workspace) => (
                    <DropdownItem
                      onClick={() => {
                        setWorkspace(item);
                        setSelectorOpened(!selectorOpened);
                      }}
                      tabIndex={0}
                      key={item.key}
                    >
                      <div className="avatar">
                        <Jdenticon
                          size="16"
                          value={encodeURIComponent(item.title)}
                        />
                      </div>
                      <span>{item.title || ""}</span>
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </Container>
          </Foco>

          <Button
            disabled={!workspace || authCodeLoading}
            value="Continue"
            onClick={() => {
              setWorkspaceSelected(true);
            }}
            loading={authCodeLoading}
          />
        </FormContent>
      </FormWrapper>
    </Wrapper>
  );
};

export default WorkspaceSelectorMini;
