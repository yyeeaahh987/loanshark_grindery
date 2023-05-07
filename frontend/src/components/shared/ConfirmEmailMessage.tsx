import React from "react";
import styled from "styled-components";
import Button from "./Button";

const Wrapper = styled.div`
  max-width: 740px;
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

const SuccessMessage = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  text-align: center;
  color: #000000;
  margin: 10px 0 20px;
  padding: 0;
  white-space: pre-wrap;
`;

type Props = {
  onContinue?: () => void;
};

const ConfirmEmailMessage = (props: Props) => {
  return (
    <Wrapper>
      <FormWrapper>
        <FormContent>
          <img
            src="/images/thank-you.png"
            alt="thank you"
            style={{
              marginBottom: "10px",
              width: "604px",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          {/*<FormTitle>Thank you!</FormTitle>*/}
          <SuccessMessage>{`We just sent you a confirmation email. Please check your email and confirm to activate your account.`}</SuccessMessage>
          {props.onContinue && (
            <Button
              value="Continue"
              onClick={() => {
                if (props.onContinue) {
                  props.onContinue();
                }
              }}
            />
          )}
          <p style={{ fontSize: "14px", textAlign: "center" }}>
            Chat with us on{" "}
            <a
              href="https://discord.gg/vueMMKeC9g"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </a>{" "}
            if you need any help.
          </p>
        </FormContent>
      </FormWrapper>
    </Wrapper>
  );
};

export default ConfirmEmailMessage;
