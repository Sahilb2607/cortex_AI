import proxy from "express-http-proxy";
export const HeaderwithProxy = (server_url) => {
    return proxy(server_url, {
        proxyReqOptDecorator: (proxyReqOpts,srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers['x-forwarded-for'] = srcReq.user.userId;
                // For customize header write x-name
            }
            return proxyReqOpts;
        }
    });
};