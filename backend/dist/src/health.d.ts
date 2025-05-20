import { ConfigService } from '@nestjs/config';
export declare class HealthService {
    private configService;
    constructor(configService: ConfigService);
    check(): {
        status: string;
        timestamp: string;
        environment: any;
        version: string;
    };
}
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    check(): {
        status: string;
        timestamp: string;
        environment: any;
        version: string;
    };
}
