export type SubscriberInformationModal = {
    address: string;
    status: string;
    key:string;
    condition: Array<any>;
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
