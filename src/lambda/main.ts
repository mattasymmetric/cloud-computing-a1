import {
    Handler,
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
} from "aws-lambda";

import fs from "fs";
import path from "path";
import App from "../app/App";
import { renderToString } from "react-dom/server";
import { ROOT_ID } from "../constants";

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

export const ServeReactHandler: ProxyHandler = async (_event, _context) => {
    // J. Jauhiainen, "Basics of React server-side rendering with Express.js", DEV Community, 2022. [Online]. Available: https://dev.to/juhanakristian/basics-of-react-server-side-rendering-with-expressjs-phd. [Accessed: 29- Apr- 2022].
    let html = fs.readFileSync(
        path.resolve(__dirname + "/index.html"),
        "utf-8"
    );
    html = html.replace(
        `<div id="${ROOT_ID}"></div>`,
        `<div id="${ROOT_ID}">${renderToString(App())}</div>`
    );
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: html,
    };
};
