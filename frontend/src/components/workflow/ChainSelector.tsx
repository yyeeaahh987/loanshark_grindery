import React from "react";
import styled from "styled-components";
import { Autocomplete } from "grindery-ui";
import { BLOCKCHAINS } from "../../constants";
import useAppContext from "../../hooks/useAppContext";

const InputWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  & > .MuiBox-root > .MuiBox-root {
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
`;

type Props = {
  onChange: (a: any) => void;
  value: string;
  errors?: any;
  setErrors?: (a: any) => void;
};

const ChainSelector = (props: Props) => {
  const { evmChains } = useAppContext();
  const { onChange, value, errors, setErrors } = props;

  const options = [...evmChains, ...BLOCKCHAINS];

  const error =
    (errors &&
      typeof errors !== "boolean" &&
      errors.length > 0 &&
      errors.find((error: any) => error && error.field === "_grinderyChain") &&
      (
        errors.find((error: any) => error && error.field === "_grinderyChain")
          .message || ""
      ).replace(`'_grinderyChain'`, "")) ||
    false;

  const handleChange = (value: any) => {
    if (setErrors) {
      setErrors(
        typeof errors !== "boolean"
          ? [
              ...errors.filter(
                (error: any) => error && error.field !== "_grinderyChain"
              ),
            ]
          : errors
      );
    }

    onChange(value);
  };

  return (
    <InputWrapper>
      <Autocomplete
        label="Blockchain"
        size="full"
        placeholder="Select a blockchain"
        onChange={handleChange}
        options={options}
        value={value}
        required
        error={error}
      />
    </InputWrapper>
  );
};

export default ChainSelector;
