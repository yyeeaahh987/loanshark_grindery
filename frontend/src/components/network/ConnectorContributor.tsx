import React from "react";
import styled from "styled-components";

const Container = styled.div`
  & > a,
  & > p {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    color: & span {

    }
  }
`;

const Avatar = styled.div`
  & img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: block;
  }
`;

type Props = {
  contributor: any;
};

const ConnectorContributor = (props: Props) => {
  const { contributor } = props;
  return contributor ? (
    <Container>
      {contributor?.[0]?.values?.github_url ? (
        <a
          href={contributor?.[0]?.values?.github_url}
          target="_blank"
          rel="noreferrer"
        >
          {contributor?.[0]?.values?.avatar_url && (
            <Avatar>
              <img src={contributor?.[0]?.values?.avatar_url} alt="" />
            </Avatar>
          )}

          <span>
            {contributor?.[0]?.values?.name ||
              contributor?.[0]?.values?.github_username}
          </span>
        </a>
      ) : (
        <p>
          {contributor?.[0]?.values?.avatar_url && (
            <Avatar>
              <img src={contributor?.[0]?.values?.avatar_url} alt="" />
            </Avatar>
          )}
          <span>
            {contributor?.[0]?.values?.name ||
              contributor?.[0]?.values?.github_username}
          </span>
        </p>
      )}
    </Container>
  ) : null;
};

export default ConnectorContributor;
