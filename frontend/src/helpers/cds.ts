// @ts-nocheck

import axios from "axios";
import { CDS_EDITOR_API_ENDPOINT } from "../constants";

// eslint-disable-next-line camelcase
export const abiToCDS = (data) => {
  const result = data // "__ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser_456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
    .replace(/(_)+/g, " ") // " ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser 456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
    .replace(/([a-z])([A-Z][a-z])/g, "$1 $2") // " To Get YourGEDIn TimeASong About The26ABCs IsOf The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times IsNot AsEasy As123ForC3POOrR2D2Or2R2D"
    .replace(/([A-Z][a-z])([A-Z])/g, "$1 $2") // " To Get YourGEDIn TimeASong About The26ABCs Is Of The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([a-z])([A-Z]+[a-z])/g, "$1 $2") // " To Get Your GEDIn Time ASong About The26ABCs Is Of The Essence But APersonal IDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, "$1 $2") // " To Get Your GEDIn Time A Song About The26ABCs Is Of The Essence But A Personal ID Card For User456In Room26A ContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
    .replace(/([a-z]+)([A-Z0-9]+)/g, "$1 $2") // " To Get Your GEDIn Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3POOr R2D2Or 2R2D"

    // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
    .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, "$1 $2") // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"
    .replace(/([0-9])([A-Z][a-z]+)/g, "$1 $2") // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC 26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"

    // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
    .replace(/([A-Z]{2,})([0-9]{2,})/g, "$1 $2") // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
    .replace(/([0-9]{2,})([A-Z]{2,})/g, "$1 $2") // " To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
    .trim(); // "To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
  // capitalize the first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function mapType(abiType) {
  abiType = abiType.replace("[]", "");
  const NUMBER_TYPES = [
    "uint8",
    "uint16",
    "uint32",
    "int8",
    "int16",
    "int32",
    "bytes1",
  ];
  if (NUMBER_TYPES.includes(abiType)) {
    return "number";
  }
  if (abiType === "bool") {
    return "boolean";
  }
  if (abiType === "address") {
    return "address";
  }
  return "string";
}
function abiInputToField(inp) {
  return {
    key: inp.name,
    label: abiToCDS(inp.name),
    type: mapType(inp.type),
    placeholder: inp.type === "address" ? "Enter a blockchain address" : "",
    list: inp.type.includes("[]"),
  };
}
function getFunctionSuffix(abiItem) {
  const items = [];
  if (abiItem.payable) {
    items.push("payable");
  }
  if (abiItem.constant) {
    items.push("view");
  }
  if (abiItem.stateMutability === "pure") {
    items.push("pure");
  }
  if (abiItem.outputs.length) {
    items.push(
      "returns " +
        (abiItem.outputs.length === 1
          ? abiItem.outputs[0].type
          : abiItem.outputs.map((x) => x.type).join(", "))
    );
  }
  if (!items.length) {
    return "";
  }
  return " " + items.join(" ");
}

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const convertImgToBase64 = (url, callback, outputFormat) => {
  var canvas = document.createElement("CANVAS");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || "image/png");
    callback.call(this, dataURL);
    // Clean up
    canvas = null;
  };
  img.src = url;
};

const convertImgToBase64Wrapper = (url) => {
  return new Promise((resolve, reject) => {
    convertImgToBase64(url, (successResponse) => {
      resolve(successResponse);
    });
  });
};

export const getCDS = async (ABI, name, icon) => {
  let parsedInput = [];
  if (ABI) {
    parsedInput = JSON.parse(ABI);
    if (!Array.isArray(parsedInput)) {
      throw Error("Invalid ABI");
    }
  }

  const key = name
    ? slugify(name.trim())
    : slugify("connector_" + new Date().toISOString());

  let isKeyExists;

  try {
    isKeyExists = await axios.get(
      `${CDS_EDITOR_API_ENDPOINT}/cds/check/${key}`
    );
  } catch (err) {
    throw Error(
      "We couldn't check if connector name is available. Please, try again later."
    );
  }

  if (isKeyExists?.data?.result) {
    throw Error(
      "Connector name has already been used. Please, try another name."
    );
  }

  const cds = {
    key: key,
    name: name || "Connector " + new Date().toISOString(),
    version: "1.0.0",
    platformVersion: "1.0.0",
    type: "web3",
    triggers: parsedInput
      .filter((x) => x.type === "event")
      .map((x) => ({
        ...x,
        inputs: x.inputs.map((x, i) => ({
          ...x,
          name: x.name || "param" + i,
        })),
      }))
      .map((x) => ({
        key: x.name + "Trigger",
        name: abiToCDS(x.name),
        display: {
          label: abiToCDS(x.name),
          description: abiToCDS(x.name),
        },
        operation: {
          type: "blockchain:event",
          signature: `event ${x.name}(${x.inputs
            .map(
              (inp) => `${inp.type} ${inp.indexed ? "indexed " : ""}${inp.name}`
            )
            .join(", ")})`,
          inputFields: x.inputs.map(abiInputToField),
          outputFields: x.inputs.map(abiInputToField),
          sample: {},
        },
      })),
    actions: parsedInput
      .filter((x) => x.type === "function")
      .map((x) => ({
        ...x,
        inputs: x.inputs.map((x, i) => ({
          ...x,
          name: x.name || "param" + i,
        })),
      }))
      .map((x) => ({
        key: x.name + "Action",
        name: abiToCDS(x.name) + (x.constant ? " (View function)" : ""),
        display: {
          label: abiToCDS(x.name) + (x.constant ? " (View function)" : ""),
          description:
            abiToCDS(x.name) + (x.constant ? " (View function)" : ""),
        },
        operation: {
          type: "blockchain:call",
          signature: `function ${x.name}(${x.inputs
            .map((inp) => `${inp.type} ${inp.name}`)
            .join(", ")})${getFunctionSuffix(x)}`,
          inputFields: x.inputs
            .map(abiInputToField)
            .map((x) => ({ ...x, required: true })),
          outputFields:
            (x.constant || x.stateMutability === "pure") &&
            x.outputs.length === 1
              ? [
                  {
                    key: "returnValue",
                    label: "Return value of " + abiToCDS(x.name),
                    type: mapType(x.outputs[0].type),
                  },
                ]
              : [],
          sample: {},
        },
      })),
  };

  if (icon) {
    if (icon.startsWith("data:")) {
      cds.icon = icon;
    }
    if (isValidHttpUrl(icon)) {
      cds.icon = await convertImgToBase64Wrapper(icon);
    }
  }

  return cds;
};
