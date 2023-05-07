import React from "react";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
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
  options?: any[];
  addressBook: any[];
  setAddressBook: (i: any) => void;
  errors?: any;
  setErrors?: (a: any) => void;
};

const ContractSelector = (props: Props) => {
  const { user } = useAppContext();
  const {
    onChange,
    value,
    options,
    addressBook,
    setAddressBook,
    errors,
    setErrors,
  } = props;

  const error =
    (errors &&
      typeof errors !== "boolean" &&
      errors.length > 0 &&
      errors.find(
        (error: any) => error && error.field === "_grinderyContractAddress"
      ) &&
      (
        errors.find(
          (error: any) => error && error.field === "_grinderyContractAddress"
        ).message || ""
      ).replace(`'_grinderyContractAddress'`, "")) ||
    false;

  const handleChange = (value: any) => {
    if (setErrors) {
      setErrors(
        typeof errors !== "boolean"
          ? [
              ...errors.filter(
                (error: any) =>
                  error && error.field !== "_grinderyContractAddress"
              ),
            ]
          : errors
      );
    }

    onChange(value);
  };

  return (
    <InputWrapper>
      <RichInput
        label="Contract address"
        placeholder="Enter contract address"
        required
        //tooltip={inputField.helpText || false}
        options={options}
        onChange={handleChange}
        value={value}
        user={user}
        hasAddressBook
        addressBook={addressBook}
        setAddressBook={setAddressBook}
        error={error}
      />
    </InputWrapper>
  );
};

export default ContractSelector;
