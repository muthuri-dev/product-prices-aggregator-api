import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class NotificationsService {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'web-scraper',
      brokers: ['localhost:6379'],
    });
    this.producer = this.kafka.producer();
  }

  async sendNotification(topic: string, message: any) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await this.producer.disconnect();
  }
}
