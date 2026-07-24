import axios from "axios";

export const nimbus = axios.create({
    baseURL: "https://ship.nimbuspost.com",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NIMBUS_API_KEY}`,
    },
});