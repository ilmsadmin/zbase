declare const _default: (() => {
    nodeEnv: string;
    port: number;
    host: string;
    frontendUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    redisHost: string;
    redisPort: number;
    mongoUri: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    host: string;
    frontendUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    redisHost: string;
    redisPort: number;
    mongoUri: string;
}>;
export default _default;
