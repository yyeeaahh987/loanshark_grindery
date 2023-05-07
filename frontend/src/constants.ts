export const SCREEN = {
  TABLET: "768px",
  TABLET_XL: "1024px",
  DESKTOP: "1280px",
  DESKTOP_XL: "1600px",
};

export const WORKFLOW_ENGINE_URL = "https://orchestrator.grindery.org";

export const CDS_EDITOR_API_ENDPOINT =
  "https://nexus-cds-editor-api.herokuapp.com/api";

export const ICONS: { [key: string]: string } = {
  WALLET: "/images/icons/wallet.svg",
  WORKFLOWS: "/images/icons/workflow.svg",
  APPS: "/images/icons/grid.svg",
  HISTORY: "/images/icons/history.svg",
  BELL: "/images/icons/bell.svg",
  DASHBOARD: "/images/icons/dashboard.svg",
  SETTINGS: "/images/icons/settings.svg",
  TRANSACTIONS: "/images/icons/list.svg",
  EXECUTED: "/images/icons/executed.svg",
  ERROR: "/images/icons/error.svg",
  DEPOSIT: "/images/icons/deposit.svg",
  GAS: "/images/icons/gas.svg",
  SERVICE: "/images/icons/service.svg",
  FEES: "/images/icons/fees.svg",
  WITHDRAW: "/images/icons/withdraw.svg",
  COMMENT: "/images/icons/comment.svg",
  GRINDERY: "/images/icons/grindery.svg",
  PLUS: "/images/icons/plus.svg",
  PLUS_SMALL: "/images/icons/plus-small.svg",
  CREATE_WITHDRAW: "/images/icons/create-withdraw.svg",
  CREATE_DEPOSIT: "/images/icons/create-deposit.svg",
  CREATE_ALERT: "/images/icons/create-alert.svg",
  CREATE_ALERT_BLACK: "/images/icons/create-alert-black.svg",
  ARROW_RIGHT: "/images/icons/arrow-right.svg",
  ARROW_RIGHT_BLACK: "/images/icons/arrow-right-black.svg",
  CLOSE: "/images/icons/close.svg",
  PLUS_WHITE: "/images/icons/plus-white.svg",
  GAS_ALERT: "/images/icons/gas-alert.svg",
  SUCCESS_ALERT: "/images/icons/success-alert.svg",
  ERROR_ALERT: "/images/icons/error-alert.svg",
  MENU: "/images/icons/menu.svg",
  BACK: "/images/icons/back.svg",
  COLLAPSE: "/images/icons/collapse.svg",
  CERAMIC_LOGO: "/images/icons/ceramic-logo.svg",
  METAMASK_LOGO: "/images/icons/metamask-logo.svg",
  JOIN_CONNECTORS: "/images/icons/join-connectors.svg",
  JOIN_ACTIONS: "/images/icons/join-actions.svg",
  PENCIL: "/images/icons/pencil.svg",
  DISCONNECT: "/images/icons/disconnect.svg",
  CHECKBOX_CHECKED: "/images/icons/checkbox-checked.svg",
  CHECKBOX_EMPTY: "/images/icons/checkbox-empty.svg",
  TRASH: "/images/icons/trash.svg",
  DOTS_HORIZONTAL: "/images/icons/dots-horizontal.svg",
  REFRESH: "/images/icons/refresh.svg",
  // CHAINS
  CHAIN_ETHEREUM: "/images/icons/ethereum.svg",
  CHAIN_ARBITRUM: "/images/icons/arbitrum.svg",
  CHAIN_GNOSIS: "/images/icons/gnosis.svg",
  CHAIN_POLYGON: "/images/icons/polygon.svg",
  CHAIN_CELO: "/images/icons/celo.svg",
  CHAIN_CRONOS: "/images/icons/cronos.svg",
  CARET_DOWN: "/images/icons/caret-down.svg",
  CARET_DOWN_LIGHT: "/images/icons/caret-down-light.svg",
  PLUS_BLACK: "/images/icons/plus-black.svg",
  EDIT: "/images/icons/edit.svg",
  COPY: "/images/icons/copy.svg",
  MANAGE: "/images/icons/manage.svg",
  LEAVE: "/images/icons/leave.svg",
  DELETE_WHITE: "/images/icons/delete-white.svg",
  WARNING: "/images/icons/warning.svg",
  FLOW_LOGO: "/images/icons/flow-logo.png",
  // Socials
  SOCIAL_DISCORD: "/images/icons/social-discord.png",
  SOCIAL_TG: "/images/icons/social-tg.png",
  SOCIAL_TWITTER: "/images/icons/social-twitter.png",
  // Workflow builder
  TRIGGER_ICON: "/images/icons/trigger-icon.svg",
  ACTION_ICON: "/images/icons/action-icon.svg",
  ADD_STEP: "/images/icons/add-step.svg",
  ANGLE_DOWN: "/images/icons/angle-down.svg",
  ANGLE_UP: "/images/icons/angle-up.svg",
  EXCLAMATION: "/images/icons/exclamation.svg",
  CHECK_CIRCLE: "/images/icons/check-circle.svg",
  TICK_ICON: "/images/icons/Flat-tick-icon.png",
  // Dev network
  GRINDERY_DEV_LOGO: "/images/icons/grindery-iso.svg",
  NEXUS_SQUARE: "/images/icons/nexus-square.svg",
  NETWORK_CHECKBOX_CHECKED: "/images/icons/network-checkbox-checked.svg",
  NETWORK_CHECKBOX_EMPTY: "/images/icons/network-checkbox-empty.svg",
  NETWORK_RADIO_SELECTED: "/images/icons/network-radio-selected.svg",
  NETWORK_RADIO_EMPTY: "/images/icons/network-radio-empty.svg",
  GITHUB_LOGO_DARK: "/images/icons/github-dark.svg",
  GITHUB_LOGO_LIGHT: "/images/icons/github-light.svg",

};

export const RIGHTBAR_TABS: {
  name: string;
  icon?: string;
  id: number;
  label: string;
  path: string;
  access?: string;
}[] = [
  /*{
    id: 0,
    name: "DASHBOARD",
    icon: ICONS.DASHBOARD,
    label: "Dashboard",
    path: "/dashboard",
  },*/
  {
    id: 0,
    name: "WORKFLOWS",
    icon: ICONS.WORKFLOWS,
    label: "Workflows",
    path: "/workflows",
  },
  // {
  //   id: 1,
  //   name: "APPS",
  //   icon: ICONS.APPS,
  //   label: "Connectors",
  //   path: "/connectors",
  // },
  // {
  //   id: 2,
  //   name: "HISTORY",
  //   icon: ICONS.HISTORY,
  //   label: "History",
  //   path: "/history",
  // },
  // {
  //   id: 3,
  //   name: "SETTINGS",
  //   icon: ICONS.SETTINGS,
  //   label: "Settings",
  //   path: "/settings",
  // },
  // {
  //   id: 4,
  //   name: "CREATE_NOTIFICATION",
  //   icon: ICONS.CREATE_ALERT_BLACK,
  //   label: "Notifications",
  //   path: "/notifications/send",
  //   access: "ws-98833cd6-7f21-425b-b01c-c534e1c53875",
  // },
  /*{
    id: 4,
    name: "TRANSACTIONS",
    icon: ICONS.TRANSACTIONS,
    label: "Transactions",
    path: "/transactions",
  },
  {
    id: 5,
    name: "NOTIFICATIONS",
    icon: ICONS.BELL,
    label: "Notifications",
    path: "/notifications",
  },*/
  {
    id: 6,
    name: "TEMPLATE",
    icon: ICONS.BELL,
    label: "Template",
    path: "/workflows/template",
  },
];

export const BLOCKCHAINS = [
  // Coming soon
  {
    value: "BitCoin",
    label: "BitCoin",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/bitcoin.png",
  },
  {
    value: "Tron",
    label: "Tron",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/tron.png",
  },
  {
    value: "Elrond",
    label: "Elrond",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/elrond.png",
  },
  {
    value: "Polkadot",
    label: "Polkadot",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/polkadot.png",
  },
  {
    value: "Kusama",
    label: "Kusama",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/kusama.png",
  },
  {
    value: "Cardano",
    label: "Cardano",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/cardano.png",
  },
  {
    value: "Solana",
    label: "Solana",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/solana.png",
  },
  {
    value: "Stellar",
    label: "Stellar",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/stellar.png",
  },
  {
    value: "Ripple",
    label: "Ripple",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/ripple.png",
  },
  {
    value: "Tezos",
    label: "Tezos",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/tezos.png",
  },
  {
    value: "Aurora",
    label: "Aurora",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/aurora.png",
  },
];

export const WEB2_CONNECTORS_PATH =
  "https://api.github.com/repos/grindery-io/grindery-nexus-schema-v2/contents/cds/web2";

export const WEB3_CONNECTORS_PATH =
  "https://api.github.com/repos/grindery-io/grindery-nexus-schema-v2/contents/cds/web3";

export const NOT_READY_TRIGGERS = [
  "hubspot",
  "juicebox",
  "multis",
  "parcel",
  "snapshot",
  "superfluid",
  "xmtp",
];

export const NOT_READY_ACTIONS = [
  "sendGrid",
  "hubspot",
  "doraFactory",
  "multis",
  "superfluid",
];

export const COMING_SOON_TRIGGERS = [
  {
    value: "Email",
    label: "Email by Nexus",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/email.png",
  },
  {
    value: "Storage",
    label: "Storage by Nexus",
    group: "Coming soon",
    disabled: true,
    icon: "/favicon.ico",
  },
  {
    value: "MassMail",
    label: "MassMail by Nexus",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/email.png",
  },
  {
    value: "Twitter",
    label: "Twitter",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/twitter.png",
  },
  {
    value: "Tyepform",
    label: "Tyepform",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/typeform.png",
  },
  {
    value: "Salesforce",
    label: "Salesforce",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/salesforce.png",
  },
  {
    value: "Outlook",
    label: "Outlook",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/outlook.png",
  },
  {
    value: "Asana",
    label: "Asana",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/asana.png",
  },
  {
    value: "Trello",
    label: "Trello",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/trello.png",
  },
];

export const COMING_SOON_ACTIONS = [
  {
    value: "Telegram",
    label: "Telegram",
    group: "Coming soon",
    disabled: true,
    icon: "https://telegram.org/favicon.ico",
  },
  {
    value: "Matter",
    label: "Matter",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/matter.png",
  },
  {
    value: "Element",
    label: "Element",
    group: "Coming soon",
    disabled: true,
    icon: "https://www.element.fi/favicon.ico",
  },
];

export const HS_PORTAL_ID = "4798503";

export const HS_FORM_ID = "80ae7474-b232-4eb8-bad7-a4b2d651d643";

export const isLocalOrStaging =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "nexus-staging.grindery.org" ||
  window.location.hostname === "flow-staging.grindery.org";

export const GRINDERY_APPS = [
  {
    url: "https://flow.grindery.org/",
    name: "Flow",
    description: "Create workflows witn no-code",
    target: "_blank",
  },
  {
    url: "https://ping.grindery.org/",
    name: "Ping",
    description: "Receive blockchain notifications",
    target: "_blank",
  },
  {
    url: "https://gateway.grindery.org/",
    name: "Gateway",
    description: "Your gateway to web3 no-code",
    target: "_blank",
  },
  {
    url: "https://network.grindery.org/",
    name: "CDS",
    description: "Create Connector Description Schema files",
    target: "_blank",
  },
];
