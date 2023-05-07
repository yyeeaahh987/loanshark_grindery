import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import { SCREEN } from "../../constants";
import useNotificationsContext from "../../hooks/useNotifications";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import Button from "../shared/Button";

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
  margin: 0 0 15px;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  padding: 0;
  margin: 0 0 30px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Counter = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 110%;
  color: #000;
  opacity: 0.5;
  position: absolute;
  right: 4px;
  bottom: 6px;
`;

const Buttons = styled.div`
  text-align: center;
`;

type Props = {};

const CreateNexusNotificationPage = (props: Props) => {
  const { workspace } = useWorkspaceContext();
  const { state, sendNotification } = useNotificationsContext();
  const [key, setKey] = useState(0);
  const [form, setForm] = useState({
    title: "",
    body: "",
    url: "",
  });
  const [error, setError] = useState({
    type: "",
    text: "",
  });
  const maxTitleLength = 70;
  const maxBodyLength = 200;
  let navigate = useNavigate();

  useEffect(() => {
    if (!workspace || workspace !== "ws-98833cd6-7f21-425b-b01c-c534e1c53875") {
      navigate("/");
    }
  }, [workspace]);

  return workspace &&
    workspace === "ws-98833cd6-7f21-425b-b01c-c534e1c53875" ? (
    <Wrapper>
      <Title>Send Notification</Title>
      <Description>
        Send push-notification to all subscribed Nexus users.
      </Description>
      <InputWrapper>
        <RichInput
          key={`${key}_title`}
          label="Notification Title"
          value={form.title}
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setForm({
              ...form,
              title: value,
            });
          }}
          options={[]}
          singleLine
          required
          error={error.type === "title" ? error.text : ""}
        />
        <Counter style={{ bottom: error.type === "title" ? "30px" : "6px" }}>
          {form.title.length}/{maxTitleLength}
        </Counter>
      </InputWrapper>
      <InputWrapper>
        <RichInput
          key={`${key}_body`}
          label="Notification Text"
          value={form.body}
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setForm({
              ...form,
              body: value,
            });
          }}
          options={[]}
          required
          error={error.type === "body" ? error.text : ""}
        />
        <Counter style={{ bottom: error.type === "body" ? "30px" : "6px" }}>
          {form.body.length}/{maxBodyLength}
        </Counter>
      </InputWrapper>
      <InputWrapper>
        <RichInput
          key={`${key}_url`}
          label="Notification link"
          value={form.url}
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setForm({
              ...form,
              url: value,
            });
          }}
          options={[]}
          tooltip="An URL where user will be redirected when clicked on a notification."
          error={error.type === "url" ? error.text : ""}
        />
      </InputWrapper>
      <Buttons>
        <Button
          loading={state.sending}
          disabled={state.sending || Boolean(state.success)}
          value={state.success || "Send"}
          color="primary"
          onClick={() => {
            if (!form.title) {
              setError({ type: "title", text: "Title is required" });
              return;
            }
            if (form.title && form.title.length > maxTitleLength) {
              setError({
                type: "title",
                text: `Title should be no longer than ${maxTitleLength} characters, including spaces`,
              });
              return;
            }
            if (!form.body) {
              setError({ type: "body", text: "Notification text is required" });
              return;
            }

            if (form.body && form.body.length > maxBodyLength) {
              setError({
                type: "body",
                text: `Notification text should be no longer than ${maxBodyLength} characters, including spaces`,
              });
              return;
            }

            if (
              form.url &&
              !/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
                form.url
              )
            ) {
              setError({
                type: "url",
                text: `Must be a valid HTTPS URL`,
              });
              return;
            }

            sendNotification(form.title, form.body, form.url);
            setForm({
              title: "",
              body: "",
              url: "",
            });
            setKey(key + 1);
          }}
        />
      </Buttons>
    </Wrapper>
  ) : null;
};

export default CreateNexusNotificationPage;
