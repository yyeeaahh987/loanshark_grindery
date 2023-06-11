export type SubscriberInformationModal = {
    address: string;
    status: string;
    condition: Array<string>;
    notification: {
        telegram: {
            status: string,
            chatId: string,
            username: string,
        },
        email: {
            status: string,
            toList: string,
            ccList: string,
        },
        discord: {
            status: string,
            chatId: string,
        },
    };
};
