const devServerId = 0; // 0: localhost, 1: netranks server

const SERVER = "https://netranks.azurewebsites.net/";

const SERVER_URL = import.meta.env.PROD ? SERVER : [
    "/",
    SERVER
][devServerId];

export default {
    SERVER_URL,
    netranksDomain: "https://netranks.ai",

    stripePublishableKey: "pk_live_51RpphHPDJ4afO8q12iGI2kehYxtGaa2FV4nAghat1ZQ7rvlXcBw9TMq92K2g3nEkLjrXFWozrxUdfCyW3qUEz9xM00uYusWOZl",

    Colors: {
        Blue: "#008AD0",
        Green: "#2ADB50",
        Red: "#ff5757",
    }
}
