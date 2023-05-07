import React, { useState } from "react";
import styled from "styled-components";
import { Switch, SuffixInput } from "grindery-ui";
import { SCREEN } from "../../constants";

const Wrapper = styled.div`
  padding: 24px 20px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
  }

  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }

  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 110%;
  padding: 0;
  margin: 0 0 40px;
`;

const Subtitle = styled.h3`
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  padding: 0;
  margin: 0 0 20px;
`;

const BalanceAlertWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 0 0 10px;
`;

const Label = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  padding: 0;
  margin: 0;
`;

const AlertConfigWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 0 0 10px;
`;

type Props = {};

const NotificationsPage = (props: Props) => {
  const [balanceAlert, setBalanceAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState("0.1");

  const handleBalanceAlertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceAlert(e.target.checked);
  };

  const handleCurrencyChange = (e: any) => {
    setAlertConfig(e.target.value);
  };
  return (
    <Wrapper>
      <Title>Notifications</Title>
      <Subtitle>Balance</Subtitle>

      <BalanceAlertWrapper>
        <Label>Low balance alert</Label>
        <Switch value={balanceAlert} onChange={handleBalanceAlertChange} />
      </BalanceAlertWrapper>
      <AlertConfigWrapper>
        <Label>Alert when is qual or lower than</Label>
        <div style={{ marginLeft: "auto", maxWidth: 84 }}>
          <SuffixInput
            value={alertConfig}
            onChange={handleCurrencyChange}
            suffix="ETH"
            placeholder=""
          />
        </div>
      </AlertConfigWrapper>
    </Wrapper>
  );
};

export default NotificationsPage;
