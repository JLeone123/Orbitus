import winston from "winston";

const filterError = winston.format((info, opts) => {
    return info.level === "error" ? info : false;
});

const filterHttp = winston.format((info, opts) => {
    return info.level === "http" ? info : false;
});

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ 
            filename: "event-bus.log",
            level: 'info',
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
            ),
        }),
        new winston.transports.File({
            filename: 'event-bus-errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
                filterError(),
            ),
        }),
        new winston.transports.File({
            filename: 'event-bus-http-requests.log',
            level: 'http',
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
                filterHttp(),
            )
        }),
    ],
});