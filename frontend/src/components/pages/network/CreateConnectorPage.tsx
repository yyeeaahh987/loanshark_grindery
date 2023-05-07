import React from "react";
import styled from "styled-components";
import ConnectorSubmission from "../../network/ConnectorSubmission";

const Container = styled.div`
  min-height: 100vh;
  background: #444444;
  box-sizing: border-box;
  padding: 75px 20px 40px;
`;

type Props = {};

const CreateConnectorPage = (props: Props) => {
  return (
    <Container>
      <ConnectorSubmission />
    </Container>
  );
};

export default CreateConnectorPage;
