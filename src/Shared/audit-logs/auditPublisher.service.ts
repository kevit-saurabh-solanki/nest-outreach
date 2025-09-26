import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class AuditPublisher {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ["amqp://localhost"],
                queue: 'audit_log',
                queueOptions: { durable: true }
            }
        })
    }

    publishLogs(log: any) {
        return this.client.emit('audit_log', log);
    }
}