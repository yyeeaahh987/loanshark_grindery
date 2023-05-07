import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useAppContext from "../../hooks/useAppContext";
import useNotificationsContext from "../../hooks/useNotifications";
import Button from "./Button";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  min-width: 300px;
  max-width: 100%;
  transform: translateX(-50%);
  padding: 24px 24px 14px;
  z-index: 9999;
  background: #ffffff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0px 10px 40px rgb(0 0 0 / 15%);
  border-left: 1px solid #dcdcdc;
  border-right: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 18px;
  line-height: 150%;
  color: #0b0d17;
  margin: 0 0 10px;
  padding: 0px;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #0b0d17;
  margin: 0 0 10px;
  padding: 0px;
  max-width: 400px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 15px;

  & .MuiButton-root {
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 14px;
  }
`;

type Props = {};

const NotificationsModal = (props: Props) => {
  const { user, accessAllowed } = useAppContext();
  const {
    requestNotificationsPermission,
    dismissNotifications,
    isUserUnSubscribed,
    isUserSubscribed,
    state,
  } = useNotificationsContext();

  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(user && !isUserUnSubscribed(user) && !isUserSubscribed(user));
  }, [user]);

  return state.browserIsSupported && user && isShowing && accessAllowed ? (
    <Container>
      <Title>Get Alerts from Grindery!</Title>
      <Description>
        Grindery can send you alerts when your workflows fail, bug fixes become
        available and new features are released.
      </Description>
      <Buttons>
        <Button
          value="No Thanks"
          onClick={() => {
            dismissNotifications(user);
            setIsShowing(false);
          }}
          variant="outlined"
        />
        <Button
          value="Allow"
          onClick={() => {
            requestNotificationsPermission();
            setIsShowing(false);
          }}
          color="primary"
        />
      </Buttons>
    </Container>
  ) : null;
};

export default NotificationsModal;
