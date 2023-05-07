import React, { useEffect, useState } from "react";
import { Tooltip } from "grindery-ui";
import styled from "styled-components";
import FileBase64 from "react-file-base64";

const Container = styled.div`
  margin: 0 0 20px;
`;

const LabelWrapper = styled.div`
  margin: 0 0 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 6px;
`;

const Label = styled.p`
  font-size: 14px;
  line-height: 150%;
  text-align: left;
  color: #0b0d17;
  font-style: normal;
  font-weight: 400;
  margin: 0;
  padding: 0;
`;

const Preview = styled.div`
  & p {
    font-size: 14px;
    line-height: 150%;
    text-align: left;
    color: #e48b05;
    font-style: normal;
    font-weight: 400;
    margin: 0;
    padding: 0;
    text-decoration: underline;
  }
`;

const Icon = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;

  & img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const Error = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #ff5858;
  margin: 4px 0 0;
  padding: 0;
`;

const InputWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;

  & input {
    padding: 17px 30px;
    text-align: center;
    border: 2px dashed #dcdcdc;
    width: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      border: 2px dashed #bbb;
    }
  }
`;

const Info = styled.span`
  color: #898989;
  font-size: 14px !important;
`;

const Required = styled.p`
  font-size: 14px;
  color: #898989;
  line-height: 150%;
  font-style: normal;
  font-weight: 400;
  margin: 0 0 0 auto;
  pafding: 0;
`;

type Props = {
  label: string;
  value: string;
  onChange: (icon: string) => void;
  error: string;
  tooltip?: string;
  required?: boolean;
};

const IconField = (props: Props) => {
  const { label, onChange, value, error, tooltip, required } = props;
  const [icon, setIcon] = useState(value || "");
  const [key, setKey] = useState(0);
  const [validation, setValidation] = useState("");

  const onFilesReady = (file: any) => {
    setValidation("");
    if (file && file.base64) {
      const type = file.type?.split("/") || [];
      if (type[0] === "image") {
        setIcon(file.base64);
      } else {
        setIcon("");
        setKey(key + 1);
        setValidation("Only image type is supported");
      }
    } else {
      setIcon("");
      setKey(key + 1);
    }
  };

  useEffect(() => {
    onChange(icon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icon]);

  return (
    <Container>
      <LabelWrapper>
        <Label>{label}</Label>
        {tooltip && (
          <Tooltip title={tooltip}>
            <Info className="material-icons notranslate MuiIcon-root MuiIcon-fontSizeMedium rich-input__label-tooltip css-kp9ftd-MuiIcon-root">
              error
            </Info>
          </Tooltip>
        )}
        {required && <Required>(required)</Required>}
      </LabelWrapper>

      <InputWrapper>
        {value && (
          <Preview>
            <Icon>
              <img src={value} alt="" />
            </Icon>
          </Preview>
        )}

        <FileBase64 key={key} multiple={false} onDone={onFilesReady} />
      </InputWrapper>
      {(validation || error) && <Error>{validation || error}</Error>}
    </Container>
  );
};

export default IconField;
