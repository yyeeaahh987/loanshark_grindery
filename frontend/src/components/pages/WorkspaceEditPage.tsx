import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RichInput, Alert } from "grindery-ui";
import Jdenticon from "react-jdenticon";
import useAppContext from "../../hooks/useAppContext";
import Button from "../shared/Button";
import { getValidationScheme } from "../../helpers/utils";
import { ICONS } from "../../constants";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router-dom";

const STRINGS = {
  TITLE: "Manage Workspace",
  SECTION_TITLE_1: "Profile",
  FIELDS: {
    AVATAR: {
      LABEL: "Avatar",
    },
    NAME: {
      LABEL: "Name",
      PLACEHOLDER: "Enter workspace name",
    },
    ABOUT: {
      LABEL: "About",
      PLACEHOLDER: "Enter description",
    },
    ADMINS: {
      LABEL: "Admins",
      PLACEHOLDER: "0x0000000000000000000000000000",
      TOOLTIP:
        "Admins can create, edit, delete, enable, disable workflows associated with this workspace; Edit, delete the workspace itself; Invite new members and admins to the workspace.\n\nInvite admins by blockchain wallet address. Enter each address on the new line.",
    },
    MEMBERS: {
      LABEL: "Members",
      PLACEHOLDER: "0x0000000000000000000000000000",
      TOOLTIP:
        "Members can create, edit, delete, enable, disable workflows associated with this workspace.\n\nInvite members by blockchain wallet address. Enter each address on the new line.",
    },
  },
  SECTION_TITLE_2: "Moderation",
  SECTION_DESCRIPTION_2: "Who can manage this Workspace and create Workflows?",
  SUBMIT_BUTTON: "Save Workspace",
  DELETE_BUTTON: "Delete Workspace",
  LEAVE_BUTTON: "Leave Workspace",
};

const Wrapper = styled.div`
  max-width: 604px;
  padding: 40px 20px;
  margin: 0 auto;

  h1 {
    font-weight: 700;
    font-size: 32px;
    line-height: 120%;
    color: #000000;
    margin: 0 0 16px;
    padding: 0;
  }

  h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 120%;
    color: #000000;
    padding: 0;
    margin: 24px 0 16px;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    color: #000000;
    padding: 0;
    margin: 0 0 16px;
  }

  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;
    display: block;
  }
`;

const Box = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  padding: 40px;

  & .MuiTextField-root {
    margin-top: 0 !important;
  }

  & .MuiTypography-root {
    font-size: 14px;
  }

  & .rich-input {
    margin-bottom: 0 !important;
  }

  & .rich-input__label-tooltip {
    font-size: 14px !important;
    margin-bottom: 3.5px !important;
  }

  & .rich-input div[contenteditable="false"] {
    cursor: not-allowed;

    & p {
      opacity: 0.5 !important;
    }
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: #f4f5f7;
  border-radius: 50%;
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 60px;
    height: 60px;
    display: block;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 14px;
  & .MuiButton-root {
    &:hover {
      box-shadow: none;
    }
  }
`;

const DeleteButtonWrapper = styled.div`
  & .MuiButton-root {
    background-color: #ff5858;

    &:hover {
      background-color: #ff5858;
      box-shadow: none;
    }
  }
`;

const LeaveButtonWrapper = styled.div`
  & .MuiButton-root {
    &:hover {
      box-shadow: none;
    }
  }
`;

const AlertWrapper = styled.div`
  margin-top: 24px;
`;

type Props = {};

const WorkspaceEditPage = (props: Props) => {
  const { user, validator, client } = useAppContext();
  const {
    workspaces,
    leaveWorkspace,
    setWorkspace,
    workspace,
    isLoaded,
    deleteWorkspace,
    updateWorkspace,
  } = useWorkspaceContext();
  const id = workspace;
  const [currentWorkspace, setCurrentWorkspace] = useState(
    workspaces.find((ws) => ws.key === id) || workspaces[0]
  );
  const isMember = currentWorkspace?.users?.includes(user);
  const isAdmin =
    currentWorkspace?.admins?.includes(user) ||
    currentWorkspace?.creator === user;
  const isPersonal = id === "personal";
  const [title, setTitle] = useState(currentWorkspace?.title || "");
  const [key, setKey] = useState(id);
  const [about, setAbout] = useState(currentWorkspace?.about || "");
  const [admins, setAdmins] = useState(
    (currentWorkspace?.admins?.join("\n") || "")
      .replace(new RegExp("eip155:1:", "g"), "")
      .replace(new RegExp("flow:mainnet:", "g"), "") || ""
  );
  const [users, setUsers] = useState(
    (currentWorkspace?.users?.join("\n") || "")
      .replace(new RegExp("eip155:1:", "g"), "")
      .replace(new RegExp("flow:mainnet:", "g"), "") || ""
  );
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<any>(false);
  let navigate = useNavigate();

  const validationSchema = getValidationScheme([
    { key: "title", required: true, type: "string" },
    { key: "admins", required: false, type: "address", list: true },
    { key: "users", required: false, type: "address", list: true },
  ]);

  const check = validator.compile(validationSchema);

  const handleSubmit = async () => {
    const validated = check({
      title,
      about,
      admins: admins.split("\n"),
      users: users.split("\n"),
    });

    if (typeof validated === "boolean") {
      // all good

      setErrors(false);
      setFormError("");
      const res = await updateWorkspace(
        user,
        {
          key: id,
          title,
          about,
          admins: admins
            .split("\n")
            .filter((address: string) => address)
            .map((address: string) =>
              !/^0x[a-zA-Z0-9]{16}$/g.test(address)
                ? `eip155:1:${address}`
                : `flow:mainnet:${address}`
            ),
          users: users
            .split("\n")
            .filter((address: string) => address)
            .map((address: string) =>
              !/^0x[a-zA-Z0-9]{16}$/g.test(address)
                ? `eip155:1:${address}`
                : `flow:mainnet:${address}`
            ),
        },
        client
      ).catch((error) => {
        if (error) {
          setFormError(error.toString());
        } else {
          setFormError("Network error. Please try again later.");
        }
      });
      if (res) {
        navigate("/");
      }
    } else {
      setErrors(validated);
      setFormError("Please complete all required fields.");
    }
  };

  const handleDelete = async () => {
    setFormError("");
    if (
      window.confirm(
        "Are you sure you want to delete the workspace?\nYou won't be able to restore it."
      )
    ) {
      const res = await deleteWorkspace(
        user,
        { workspaceKey: currentWorkspace.key, title },
        client
      ).catch((error) => {
        if (error) {
          setFormError(error.toString());
        } else {
          setFormError("Network error. Please try again later.");
        }
      });
      if (res) {
        setWorkspace("personal");
        navigate("/");
      }
    }
  };

  const handleLeave = async () => {
    if (
      window.confirm(
        "Are you sure you want to leave the workspace?\nYou will lose access to all workflows associated with this workspace."
      )
    ) {
      const res = await leaveWorkspace(
        user,
        { workspaceKey: currentWorkspace.key, title },
        client
      ).catch((error) => {
        console.error("error", error.toString());

        if (error) {
          setFormError(error.toString());
        } else {
          setFormError("Network error. Please try again later.");
        }
      });
      if (res) {
        setWorkspace("personal");
        navigate("/");
      }
    }
  };

  const fieldError = (fieldName: string, errors: any, includes?: boolean) => {
    return (
      (errors &&
        typeof errors !== "boolean" &&
        errors.length > 0 &&
        errors.find(
          (error: any) =>
            error &&
            (includes
              ? error.field.includes(fieldName)
              : error.field === fieldName)
        ) &&
        (
          errors.find(
            (error: any) =>
              error &&
              (includes
                ? error.field.includes(fieldName)
                : error.field === fieldName)
          ).message || ""
        ).replace(`'${fieldName}'`, "")) ||
      ""
    );
  };

  const updateErrors = (fieldName: string, errors: any, includes?: boolean) => {
    setFormError("");
    setErrors(
      typeof errors !== "boolean"
        ? [
            ...errors.filter(
              (error: any) =>
                error &&
                (includes
                  ? !error.field.includes(fieldName)
                  : error.field !== fieldName)
            ),
          ]
        : errors
    );
  };

  useEffect(() => {
    if (id) {
      const newCurrentWorkspace =
        workspaces.find((ws) => ws.key === id) || workspaces[0];
      setCurrentWorkspace(newCurrentWorkspace);
      setTitle(newCurrentWorkspace?.title || "");
      setAbout(newCurrentWorkspace?.about || "");
      setAdmins(
        (newCurrentWorkspace?.admins?.join("\n") || "")
          .replace(new RegExp("eip155:1:", "g"), "")
          .replace(new RegExp("flow:mainnet:", "g"), "") || ""
      );
      setUsers(
        (newCurrentWorkspace?.users?.join("\n") || "")
          .replace(new RegExp("eip155:1:", "g"), "")
          .replace(new RegExp("flow:mainnet:", "g"), "") || ""
      );
      setFormError("");
      setErrors(false);
      setKey(id);
    }
  }, [id, workspaces]);

  return isLoaded && id ? (
    <Wrapper>
      <h1>{STRINGS.TITLE}</h1>
      <h3>{STRINGS.SECTION_TITLE_1}</h3>
      <Box>
        <div style={{ marginBottom: "24px" }}>
          <label>{STRINGS.FIELDS.AVATAR.LABEL}</label>
          <Avatar>
            <Jdenticon
              size="60"
              value={encodeURIComponent(title || "Avatar")}
            />
          </Avatar>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <RichInput
            key={key + "title"}
            label={STRINGS.FIELDS.NAME.LABEL}
            onChange={(value: string) => {
              setTitle(value);
              updateErrors("title", errors);
            }}
            value={title}
            placeholder={STRINGS.FIELDS.NAME.PLACEHOLDER}
            options={[]}
            error={fieldError("title", errors)}
            singleLine
            readonly={isPersonal || (isMember && !isAdmin)}
          />
        </div>
        <div>
          <RichInput
            key={key + "about"}
            label={STRINGS.FIELDS.ABOUT.LABEL}
            onChange={(value: string) => {
              setAbout(value);
            }}
            value={about}
            placeholder={STRINGS.FIELDS.ABOUT.PLACEHOLDER}
            options={[]}
            readonly={isPersonal || (isMember && !isAdmin)}
          />
        </div>
      </Box>
      {isAdmin && !isPersonal && (
        <>
          <h3>{STRINGS.SECTION_TITLE_2}</h3>
          <p>{STRINGS.SECTION_DESCRIPTION_2}</p>
          <Box>
            <div style={{ marginBottom: "24px" }}>
              <RichInput
                key={key + "admin"}
                label={STRINGS.FIELDS.ADMINS.LABEL}
                onChange={(value: string) => {
                  setAdmins(value);
                  updateErrors("admins[", errors, true);
                }}
                value={admins}
                placeholder={STRINGS.FIELDS.ADMINS.PLACEHOLDER}
                options={[]}
                tooltip={STRINGS.FIELDS.ADMINS.TOOLTIP}
                error={fieldError("admins[", errors, true)}
              />
            </div>
            <div>
              <RichInput
                key={key + "users"}
                label={STRINGS.FIELDS.MEMBERS.LABEL}
                onChange={(value: string) => {
                  setUsers(value);
                  updateErrors("users[", errors, true);
                }}
                value={users}
                placeholder={STRINGS.FIELDS.MEMBERS.PLACEHOLDER}
                options={[]}
                tooltip={STRINGS.FIELDS.MEMBERS.TOOLTIP}
                style={{ marginBottom: 0 }}
                error={fieldError("users[", errors, true)}
              />
            </div>
          </Box>
        </>
      )}
      {formError && (
        <AlertWrapper>
          <Alert
            color="error"
            elevation={0}
            icon={
              <img
                src={ICONS.ERROR_ALERT}
                width={20}
                height={20}
                alt="error icon"
              />
            }
          >
            <div style={{ textAlign: "left" }}>{formError}</div>
          </Alert>
        </AlertWrapper>
      )}
      {isAdmin && !isPersonal && (
        <ButtonWrapper>
          <Button
            onClick={handleSubmit}
            value={STRINGS.SUBMIT_BUTTON}
            fullWidth
          />
        </ButtonWrapper>
      )}
      {(isMember ||
        (isAdmin &&
          currentWorkspace?.admins &&
          currentWorkspace?.admins.length > 1)) && (
        <LeaveButtonWrapper style={{ marginTop: isMember ? "14px" : 0 }}>
          <Button
            onClick={handleLeave}
            value={STRINGS.LEAVE_BUTTON}
            fullWidth
            variant="outlined"
            hideIconBorder
            icon={ICONS.LEAVE}
          />
        </LeaveButtonWrapper>
      )}
      {isAdmin && !isPersonal && (
        <DeleteButtonWrapper>
          <Button
            onClick={handleDelete}
            value={STRINGS.DELETE_BUTTON}
            fullWidth
            color="error"
            hideIconBorder
            icon={ICONS.DELETE_WHITE}
          />
        </DeleteButtonWrapper>
      )}
    </Wrapper>
  ) : null;
};

export default WorkspaceEditPage;
