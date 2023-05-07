import {
  getOutputOptions,
  getParameterByName,
  jsonrpcObj,
  replaceTokens,
} from "../../helpers/utils";
import helloWorldConnector from "../../samples/connectors/helloworld.json";

describe("getParameterByName function", () => {
  test("returns URL parameter value by name", () => {
    const name = "test";
    const url = "https://nexus.grindery.org?test=1";

    const output = "1";

    expect(getParameterByName(name, url)).toEqual(output);
  });

  test("returns null if parameter not found", () => {
    const name = "test";
    const url = "https://nexus.grindery.org";

    const output = null;

    expect(getParameterByName(name, url)).toEqual(output);
  });

  test("uses current URL if no url provided", () => {
    const name = "test";

    const output = null;

    expect(getParameterByName(name)).toEqual(output);
  });

  test("returns empty string if parameter has no value", () => {
    const name = "test";
    const url = "https://nexus.grindery.org?test=";

    const output = "";

    expect(getParameterByName(name, url)).toEqual(output);
  });
});

describe("replaceTokens function", () => {
  test("replaces token in object with data from context", () => {
    const input = {
      input1: "{{test}}",
    };
    const context = {
      test: "test value",
    };

    const output = {
      input1: "test value",
    };

    expect(replaceTokens(input, context)).toEqual(output);
  });

  test("replaces tokens in object with empty string if no data found in context", () => {
    const input = {
      input1: "{{test}}",
    };
    const context = {};

    const output = {
      input1: "",
    };

    expect(replaceTokens(input, context)).toEqual(output);
  });

  test("replaces array of tokens in object with data from context", () => {
    const input = {
      input1: ["{{test}}", "{{test2}}"],
    };
    const context = {
      test: "test value",
      test2: "test value 2",
    };

    const output = {
      input1: ["test value", "test value 2"],
    };

    expect(replaceTokens(input, context)).toEqual(output);
  });

  test("returns unmodified number if input is a number", () => {
    const input = 1;
    const context = {
      test: "test value",
      test2: "test value 2",
    };

    const output = 1;

    expect(replaceTokens(input, context)).toEqual(output);
  });
});

describe("getOutputOptions function", () => {
  test("returns array of output options for provided operation", () => {
    const operation = helloWorldConnector.triggers[0].operation;
    const connector = helloWorldConnector;

    const output = [
      {
        value: "{{trigger.random}}",
        label: "A random string",
        reference: "abc",
        icon: helloWorldConnector.icon || "",
        group: helloWorldConnector.name,
      },
      {
        value: "{{trigger.random2[0]}}",
        label: "A random strings[0]",
        reference: "abc",
        icon: helloWorldConnector.icon || "",
        group: helloWorldConnector.name,
      },
      {
        value: "{{trigger.random2[1]}}",
        label: "A random strings[1]",
        reference: "def",
        icon: helloWorldConnector.icon || "",
        group: helloWorldConnector.name,
      },
    ];

    expect(getOutputOptions(operation, connector)).toEqual(output);
  });

  test("returns empty array if no operation provided", () => {
    const operation = null;
    const connector = helloWorldConnector;

    const output = [];

    expect(getOutputOptions(operation, connector)).toEqual(output);
  });
});

describe("jsonrpcObj function", () => {
  test("returns JSON RPC 2.0 request object", () => {
    const method = "method_name";
    const params = {
      param1: "foo",
      param2: "bar",
    };

    const output = {
      jsonrpc: "2.0",
      method: "method_name",
      id: new Date(),
      params: {
        param1: "foo",
        param2: "bar",
      },
    };

    expect(jsonrpcObj(method, params)).toEqual(output);
  });
});
