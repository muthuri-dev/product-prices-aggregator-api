import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.client = createClient({
        url: this.configService.getOrThrow<string>('REDIS_URL'),
      });

      this.client.on('error', (err) => {
        console.error('Redis Error:', err);
      });

      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.client) {
        await this.client.quit();
        console.log('Disconnected from Redis');
      }
    } catch (error) {
      console.error('Error while disconnecting from Redis:', error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error getting key "${key}" from Redis:`, error.message);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.set(key, value, { EX: ttl });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Error setting key "${key}" in Redis:`, error.message);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key "${key}" in Redis:`, error.message);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists > 0;
    } catch (error) {
      console.error(
        `Error checking existence of key "${key}" in Redis:`,
        error.message,
      );
      return false;
    }
  }

  async setJSON(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const jsonString = JSON.stringify(value);
      await this.set(key, jsonString, ttl);
    } catch (error) {
      console.error(`Error setting JSON key "${key}" in Redis:`, error.message);
    }
  }

  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(
        `Error getting JSON key "${key}" from Redis:`,
        error.message,
      );
      return null;
    }
  }
}
