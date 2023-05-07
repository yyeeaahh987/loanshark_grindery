import React, { useState } from "react";
import _ from "lodash";
import styled from "styled-components";
import moment from "moment";
import { Dialog, TextInput, Tabs } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS, SCREEN } from "../../constants";
import transactions from "../../samples/transactions";
import useWindowSize from "../../hooks/useWindowSize";
import Button from "../shared/Button";

type Transaction = {
  id: string | number;
  type: string;
  name: string;
  amount: number;
  token: string;
  usd: number;
  timestamp: number;
  details?: string;
  comment?: string;
};

const typeIconMapping: { [key: string]: string } = {
  deposit: ICONS.DEPOSIT,
  gas: ICONS.GAS,
  services: ICONS.SERVICE,
  fees: ICONS.FEES,
  withdraw: ICONS.WITHDRAW,
};

const RootWrapper = styled.div`
  @media (min-width: ${SCREEN.TABLET}) {
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
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

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 5px;
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
`;

const GroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;
`;

const GroupTitleWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const GroupTitle = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-subtitle);
  line-height: 150%;
  opacity: 0.5;
`;

const GroupSummaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 6px;
`;

const GroupSummaryUsd = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-subtitle);
  line-height: 150%;
  color: #898989;
`;

const GroupSummarySeparator = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-subtitle);
  line-height: 150%;
`;

const GroupSummaryToken = styled.div`
  font-weight: 700;
  font-size: var(--text-size-transactions-subtitle);
  line-height: 150%;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ItemIcon = styled.img`
  width: 40px;
  height: 40px;
  display: block;
`;

const ItemTitle = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-label);
  line-height: 150%;
`;

const ItemSubtitle = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-subtitle);
  line-height: 150%;
  color: #898989;
`;

const ItemNumbers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const ItemTokens = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-label);
  line-height: 150%;
`;

const ItemUSD = styled.div`
  font-weight: 400;
  font-size: var(--text-size-transactions-subtitle);
  line-height: 150%;
  color: #898989;
`;

const DialogTitle = styled.h3`
  font-weight: 700;
  font-size: 25px;
  line-height: 130%;
  padding: 0;
  margin: 0 0 20px;
`;

const DialogSubtitleWrapper = styled.div`
  margin: 0 0 20px;
`;

const DialogSubtitle = styled.h4`
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  padding: 0;
  margin: 0;
`;

const DialogAddress = styled.h5`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  padding: 0;
  margin: 4px 0 0;
`;

const DialogDetails = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  padding: 0;
  margin: 0 0 20px;
`;

const DialogComment = styled.div`
  background: #f4f5f7;
  border-radius: 8px;
  padding: 10px;
  margin: 0 0 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const DialogCommentIcon = styled.img`
  width: 16px;
  min-width: 16px;
  height: 24px;
  margin-right: 10px;
`;

const DialogCommentText = styled.p`
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #898989;
  padding: 0;
  margin: 0;
`;

const DialogDateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const DialogDateLabel = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 160%;
  padding: 0;
  margin: 0;
`;

const DialogDate = styled.p`
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  padding: 0;
  margin: 0 0 0 auto;
`;

const DialogAmount = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  opacity: 0.5;
  padding: 0;
  text-align: right;
  margin: 0 0 20px;
`;

type Props = {};

const TransactionsPage = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [items, setItems] = useState<Transaction[]>(transactions);
  const [dialog, setDialog] = useState<null | string | number>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState(0);
  const { size } = useWindowSize();

  const filteredItems = items
    .filter((item) => {
      if (tab === 0) return true;
      if (tab === 1 && item.type === "deposit") return true;
      if (tab === 2 && item.type === "gas") return true;
      if (tab === 3 && item.type === "fees") return true;
      if (tab === 4 && item.type === "services") return true;
      if (tab === 5 && item.type === "withdraw") return true;
      return false;
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // convert real timestamps to day timestamps
  const itemsWithDates = filteredItems.map((item) => ({
    ...item,
    date: moment(moment(item.timestamp).format("DD MMMM YYYY"), "DD MMMM YYYY")
      .format("x")
      .toString(),
  }));

  // group items by day timestamp
  const groupedItems = _.groupBy(itemsWithDates, "date");

  // sort groups by day
  const orderedGroups = Object.keys(groupedItems)
    .sort()
    .reverse()
    .reduce((obj: any, key: string) => {
      obj[key] = groupedItems[key];
      return obj;
    }, {});

  const handleSearchChange = (e: string) => {
    setSearchTerm(e);
  };

  const renderItem = (item: Transaction) => {
    const typeName =
      item.type === "deposit"
        ? "Funding"
        : item.type === "withdraw"
        ? "Withdrawal"
        : item.type.charAt(0).toUpperCase() + item.type.slice(1);

    return (
      <React.Fragment key={item.id}>
        <DataBox
          onClick={() => {
            setDialog(item.id);
          }}
          size="small"
          LeftComponent={
            <ItemTitleWrapper>
              <ItemIcon src={typeIconMapping[item.type]} alt={item.type} />
              <div>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemSubtitle>{typeName}</ItemSubtitle>
              </div>
            </ItemTitleWrapper>
          }
          RightComponent={
            <ItemNumbers>
              <ItemTokens>
                {item.amount} {item.token}
              </ItemTokens>
              <ItemUSD>
                {item.type !== "deposit" ? "- " : ""}${item.usd}
              </ItemUSD>
            </ItemNumbers>
          }
        />
        <Dialog
          open={dialog === item.id}
          onClose={() => {
            setDialog(null);
          }}
          maxWidth={size === "phone" ? "375px" : "590px"}
        >
          <DialogTitle>
            {item.type !== "deposit" ? "- " : ""}${item.usd}
          </DialogTitle>
          <DialogSubtitleWrapper>
            <DialogSubtitle>{item.name}</DialogSubtitle>
            <DialogAddress>{typeName}</DialogAddress>
          </DialogSubtitleWrapper>
          {item.details && <DialogDetails>{item.details}</DialogDetails>}
          {item.comment && (
            <DialogComment>
              <DialogCommentIcon src={ICONS.COMMENT} alt="comment icon" />
              <DialogCommentText>{item.comment}</DialogCommentText>
            </DialogComment>
          )}
          <DialogDateWrapper>
            <DialogDateLabel>Date</DialogDateLabel>
            <DialogDate>
              {moment(item.timestamp).format("DD MMMM YYYY")}
            </DialogDate>
          </DialogDateWrapper>
          <DialogAmount>
            {item.type !== "deposit" ? "- " : ""}
            {item.amount} {item.token}
          </DialogAmount>
          <Button
            variant="outlined"
            value="Close"
            onClick={() => {
              setDialog(null);
            }}
            fullWidth
          />
        </Dialog>
      </React.Fragment>
    );
  };

  return (
    <RootWrapper>
      <TabsWrapper>
        <Tabs
          value={tab}
          onChange={(index: number) => {
            setTab(index);
          }}
          options={["All", "Deposit", "Gas", "Fees", "Service", "Withdrawal"]}
          orientation="horizontal"
          activeIndicatorColor="#A963EF"
          activeColor="#8C30F5"
          type="text"
          tabColor=""
          variant="scrollable"
        />
      </TabsWrapper>
      <Wrapper>
        <SearchWrapper>
          <SearchInputWrapper>
            <TextInput
              placeholder={"Transactions"}
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              type="search"
              icon="search"
            />
          </SearchInputWrapper>
        </SearchWrapper>
        <GroupsWrapper>
          {Object.keys(orderedGroups).map((key) => (
            <div key={key}>
              <GroupTitleWrapper>
                <GroupTitle>
                  {moment(parseInt(key)).format("DD MMMM YYYY")}
                </GroupTitle>
                <GroupSummaryWrapper>
                  <GroupSummaryUsd>
                    {orderedGroups[key]
                      .map((item: { usd: number; type: string }) =>
                        item.type !== "deposit" ? item.usd * -1 : item.usd
                      )
                      .reduce((acc: number, val: number) => acc + val, 0) < 0
                      ? "- "
                      : ""}
                    $
                    {orderedGroups[key]
                      .map((item: { usd: number }) => item.usd)
                      .reduce((acc: number, val: number) => acc + val, 0)}
                  </GroupSummaryUsd>
                  <GroupSummarySeparator>|</GroupSummarySeparator>
                  <GroupSummaryToken>
                    {orderedGroups[key]
                      .map((item: { amount: number; type: string }) =>
                        item.type !== "deposit" ? item.amount * -1 : item.amount
                      )
                      .reduce((acc: number, val: number) => acc + val, 0) < 0
                      ? "- "
                      : ""}
                    {orderedGroups[key]
                      .map(
                        (item: { amount: number; type: string }) => item.amount
                      )
                      .reduce((acc: number, val: number) => acc + val, 0)
                      .toFixed(4)}
                    {" ETH"}
                  </GroupSummaryToken>
                </GroupSummaryWrapper>
              </GroupTitleWrapper>
              <ItemsWrapper>{orderedGroups[key].map(renderItem)}</ItemsWrapper>
            </div>
          ))}
        </GroupsWrapper>
      </Wrapper>
    </RootWrapper>
  );
};

export default TransactionsPage;
