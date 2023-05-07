import React from "react";
import styled from "styled-components";
import { SuffixInput } from "grindery-ui";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const Label = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin-right: 6px;
  text-align: left;
`;

const InputWrapper = styled.div`
  margin-left: auto;
  max-width: 150px;

  & .MuiTextField-root {
    background: #fff !important;
  }

  & .MuiTypography-root {
    font-size: 14px !important;
  }

  & .MuiOutlinedInput-root {
    background: #fff !important;
    height: 29px !important;
    margin-top: 2px !important;
  }

  & .MuiInputBase-root {
    font-size: 14px;
    padding: 0 8px !important;
  }
`;

type Props = {
  value: string;
  onChange: (a: any) => void;
  suffix?: string;
  placeholder?: string;
};

const GasInput = (props: Props) => {
  const { value, onChange, suffix, placeholder } = props;
  return (
    <Wrapper>
      <Label>Set gas limit for this action:</Label>
      <InputWrapper>
        <SuffixInput
          value={value}
          onChange={onChange}
          suffix={suffix || "ETH"}
          placeholder={placeholder || ""}
        />
      </InputWrapper>
    </Wrapper>
  );
};

export default GasInput;
