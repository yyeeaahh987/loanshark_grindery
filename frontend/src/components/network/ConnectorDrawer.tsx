import React from "react";
import _ from "lodash";
import { useLocation, useNavigate } from "react-router";
import { Drawer } from "grindery-ui";
import styled from "styled-components";
import ConnectorDrawerHeader from "./ConnectorDrawerHeader";
import useConnectorContext from "../../hooks/useConnectorContext";
import { ICONS } from "../../constants";

const DrawerWrapper = styled.div`
  .MuiPaper-root {
    transform: none !important;
    visibility: visible !important;
    width: 305px;
    background: #f4f5f7;
    border-right: 1px solid #dcdcdc;
  }
`;

const ConnectorMenuHeader = styled.h4`
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-transform: uppercase;
  color: #898989;
  margin: 0;
  padding: 15px 20px;
`;

const ConnectorMenu = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;

  & > li {
    padding: 0;
    margin: 0;
    & > span {
      display: block;
      padding: 15px 15px 15px 40px;
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;
      color: #141416;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      &.active,
      &.active:hover {
        background: #ffb930;
      }
    }

    & > ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      & > li {
        margin: 0;
        padding: 0;
        & > span {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          justify-content: flex-start;
          gap: 10px;
          padding: 15px 15px 15px 55px;
          font-weight: 400;
          font-size: 16px;
          line-height: 150%;
          color: #141416;
          cursor: pointer;

          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }

          &.active,
          &.active:hover {
            background: #ffb930;
          }
        }
      }
    }
  }
`;

const Icon = styled.div`
  & > img {
    max-width: 16px;
    height: 16px;
    display: block;
  }
`;

type Props = {};

const ConnectorDrawer = (props: Props) => {
  const { state } = useConnectorContext();
  const { connector, id, cds } = state;
  let naigate = useNavigate();
  let location = useLocation();
  return (
    <DrawerWrapper>
      <Drawer open anchor="left" variant="persistent">
        <div style={{ minHeight: "75px" }}></div>
        <ConnectorDrawerHeader connector={connector} />
        <div>
          <ConnectorMenuHeader>BUILD</ConnectorMenuHeader>
          <ConnectorMenu>
            <li>
              <span
                className={
                  location.pathname === `/network/connector/${id}`
                    ? "active"
                    : ""
                }
                onClick={() => {
                  naigate(`/network/connector/${id}`);
                }}
              >
                Connector Overview
              </span>
            </li>
            <li>
              <span
                className={
                  location.pathname === `/network/connector/${id}/settings`
                    ? "active"
                    : ""
                }
                onClick={() => {
                  naigate(`/network/connector/${id}/settings`);
                }}
              >
                Settings
              </span>
            </li>
            <li>
              <span
                className={
                  location.pathname === `/network/connector/${id}/triggers`
                    ? "active"
                    : ""
                }
                onClick={() => {
                  naigate(`/network/connector/${id}/triggers`);
                }}
              >
                Triggers
              </span>
              {cds?.triggers && cds?.triggers.length > 0 && (
                <ul>
                  {[
                    ..._.orderBy(
                      (cds?.triggers || []).filter(
                        (op: any) => op.display.featured
                      ),
                      [(op: any) => op.display.label?.toLowerCase()],
                      ["asc"]
                    ),
                    ..._.orderBy(
                      (cds?.triggers || []).filter(
                        (op: any) => !op.display.featured
                      ),
                      [(op: any) => op.display.label?.toLowerCase()],
                      ["asc"]
                    ),
                  ].map((trigger: any) => (
                    <li key={trigger.key}>
                      <span
                        className={
                          location.pathname.includes(
                            `/network/connector/${id}/triggers/${trigger.key}/`
                          )
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          naigate(
                            `/network/connector/${id}/triggers/${trigger.key}/settings`
                          );
                        }}
                      >
                        <Icon>
                          <img src={ICONS.TRIGGER_ICON} alt="" />
                        </Icon>
                        {trigger.display?.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <span
                className={
                  location.pathname === `/network/connector/${id}/actions`
                    ? "active"
                    : ""
                }
                onClick={() => {
                  naigate(`/network/connector/${id}/actions`);
                }}
              >
                Actions
              </span>
              {cds?.actions && cds?.actions.length > 0 && (
                <ul>
                  {[
                    ..._.orderBy(
                      (cds?.actions || []).filter(
                        (op: any) => op.display.featured
                      ),
                      [(op: any) => op.display.label?.toLowerCase()],
                      ["asc"]
                    ),
                    ..._.orderBy(
                      (cds?.actions || []).filter(
                        (op: any) => !op.display.featured
                      ),
                      [(op: any) => op.display.label?.toLowerCase()],
                      ["asc"]
                    ),
                  ].map((action: any) => (
                    <li key={action.key}>
                      <span
                        className={
                          location.pathname.includes(
                            `/network/connector/${id}/actions/${action.key}/`
                          )
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          naigate(
                            `/network/connector/${id}/actions/${action.key}/settings`
                          );
                        }}
                      >
                        <Icon>
                          <img src={ICONS.ACTION_ICON} alt="" />
                        </Icon>
                        {action.display?.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <span
                className={
                  location.pathname === `/network/connector/${id}/advanced`
                    ? "active"
                    : ""
                }
                onClick={() => {
                  naigate(`/network/connector/${id}/advanced`);
                }}
              >
                Source Code
              </span>
            </li>
          </ConnectorMenu>
        </div>
      </Drawer>
    </DrawerWrapper>
  );
};

export default ConnectorDrawer;
