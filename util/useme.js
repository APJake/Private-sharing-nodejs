class UseMe {
    getMessageUiModels(messages) {
        let uiMessages = [];
        let index = 0;
        let tmp = [];
        let prevAddress = "";
        while (index < messages.length) {
            const message = messages[index];

            if (message.address == prevAddress) {
                tmp.push(message.message);
            } else {
                if (tmp.length > 0) {
                    uiMessages.push({
                        address: prevAddress,
                        messages: [...tmp],
                    });
                }
                tmp = [message.message];
            }
            prevAddress = message.address;
            index++;
        }
        if (tmp.length > 0)
            uiMessages.push({
                address: prevAddress,
                messages: [...tmp],
            });
        return uiMessages.reverse();
    }
}

module.exports = new UseMe();
