// @ts-nocheck
/* eslint-disable */
import Validator from "fastest-validator";

const validator = new Validator({
  messages: {
    address: "The field must be a blockchain address.",
    evmAddress: "The field must be an EVM compatible blockchain address.",
    flowAddress: "The field must be a Flow compatible blockchain address.",
    fieldRequired: "The field must not be empty.",
  },
});

validator.add("address", function ({ schema, messages }, path, context) {
  return {
    source: `
              if (value && !/^0x[a-fA-F0-9]{40}$/g.test(value) && !/^0x[a-zA-Z0-9]{16}$/g.test(value) && !/^[a-zA-Z0-9]{16}$/g.test(value) && value !== '0x0' && !/\{\{\s*([^}]+?)\s*\}\}/.test(value))
                  ${this.makeError({
                    type: "address",
                    actual: "value",
                    messages,
                  })}

                  if (!value && ${!schema.optional} && ${!schema.empty})
                  ${this.makeError({
                    type: "fieldRequired",
                    actual: "value",
                    messages,
                  })}
  
              return value;
          `,
  };
});

validator.add("evmAddress", function ({ schema, messages }, path, context) {
  return {
    source: `
            if (value && !/^0x[a-fA-F0-9]{40}$/g.test(value) && value !== '0x0' && !/\{\{\s*([^}]+?)\s*\}\}/.test(value))
                ${this.makeError({
                  type: "evmAddress",
                  actual: "value",
                  messages,
                })}

              if (!value && ${!schema.optional} && ${!schema.empty})
                ${this.makeError({
                  type: "fieldRequired",
                  actual: "value",
                  messages,
                })}

            return value;
        `,
  };
});

validator.add("flowAddress", function ({ schema, messages }, path, context) {
  return {
    source: `
              if (value && !/^0x[a-zA-Z0-9]{16}$/g.test(value) && !/^[a-zA-Z0-9]{16}$/g.test(value) && value !== '0x0' && !/\{\{\s*([^}]+?)\s*\}\}/.test(value))
                  ${this.makeError({
                    type: "flowAddress",
                    actual: "value",
                    messages,
                  })}

                  if (!value && ${!schema.optional} && ${!schema.empty})
                  ${this.makeError({
                    type: "fieldRequired",
                    actual: "value",
                    messages,
                  })}
  
              return value;
          `,
  };
});

export { validator };
