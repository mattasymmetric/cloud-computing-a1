import path from "path";
import { Compiler, Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { merge } from "webpack-merge";
import { ROOT_ID, WEBSITE_TITLE } from "./src/constants";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import shelljs from "shelljs";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

// "Writing a Plugin | webpack", webpack, 2022. [Online]. Available: https://webpack.js.org/contribute/writing-a-plugin/. [Accessed: 29- Apr- 2022].

class OnDonePlugin {
    private var: () => void;
    constructor(func: () => void) {
        this.var = func;
    }
    apply(compiler: Compiler) {
        compiler.hooks.done.tap("OnDone Plugin", (_) => {
            this.var();
        });
    }
}

// Begin Configuration

let env_vars = dotenv.config();
dotenvExpand.expand(env_vars);

const CLIENT_PATH = path.join(__dirname, "./src/client");
const LAMBDA_PATH = path.join(__dirname, "./src/lambda");
const PROD_BUILD_MODE = "production";
const DEV_BUILD_MODE = "development";

// H. Typescript, C. Poyrazoğlu and T. Cernicova-Dragomir, "How to define string literal union type from constants in Typescript", Stack Overflow, 2022. [Online]. Available: https://stackoverflow.com/questions/56263200/how-to-define-string-literal-union-type-from-constants-in-typescript. [Accessed: 29- Apr- 2022].
let BuildMode: typeof PROD_BUILD_MODE | typeof DEV_BUILD_MODE;
if (process.env.NODE_ENV == PROD_BUILD_MODE) {
    BuildMode = PROD_BUILD_MODE;
} else {
    BuildMode = DEV_BUILD_MODE;
}

const CommonConfig: Configuration = {
    mode: BuildMode,
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};

const ClientConfig: Configuration = merge<Configuration>(CommonConfig, {
    entry: {
        client: path.join(CLIENT_PATH, "./index.tsx"),
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "build/dist"),
        publicPath: process.env.CLOUDFRONT_CDN,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: path.join(CLIENT_PATH, "tsconfig.json"),
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "!!handlebars-loader!src/assets/index.hbs",
            templateParameters: {
                title: WEBSITE_TITLE,
                root_id: ROOT_ID,
            },
        }),
        new OnDonePlugin(() => {
            // Package emitted files for lambda deployment. Limit compression to level 4 for faster decompression.
            // "shelljs", npm, 2022. [Online]. Available: https://www.npmjs.com/package/shelljs. [Accessed: 29- Apr- 2022].
            if (
                shelljs.exec(
                    `zip -4 -j ${process.env.FRONTEND_PACKAGE} build/dist/index.html`
                ).code !== 0
            ) {
                shelljs.echo("Failed to Zip index.html to Package!");
                shelljs.exit(1);
            }
        }),
    ],
});

const LambdaConfig: Configuration = merge<Configuration>(CommonConfig, {
    target: "node",
    entry: {
        lambda: path.join(LAMBDA_PATH, "./main.ts"),
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build/handler"),
        libraryTarget: "commonjs2",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: path.join(LAMBDA_PATH, "tsconfig.json"),
                },
            },
        ],
    },
    externalsPresets: {
        node: true,
    },
    externalsType: "commonjs2",
    plugins: [
        new OnDonePlugin(() => {
            if (
                shelljs.exec(
                    `zip -4 -j ${process.env.FRONTEND_PACKAGE} build/handler/main.js`
                ).code !== 0
            ) {
                shelljs.echo("Failed to Zip main.js to Package!");
                shelljs.exit(1);
            }
        }),
    ],
});

const Config: Configuration[] = [ClientConfig, LambdaConfig];

export default Config;
