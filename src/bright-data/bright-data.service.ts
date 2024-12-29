import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface BrightDataTriggerResponse {
  snapshot_id: string;
}

interface BrightDataFetchResponse {
  data: any[]; // Replace `any` with the actual type if available
}

@Injectable()
export class BrightDataService {
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('AMAZON_API_URL');
    this.apiToken = this.configService.get<string>('AMAZON_API_TOKEN');
  }

  async triggerDataCollection(
    inputs: Array<{
      keywords: string;
      domain: string;
      pages_to_search: number;
    }>,
  ): Promise<string> {
    const url = `${this.apiUrl}/datasets/v3/trigger`;

    const response = await firstValueFrom(
      this.httpService.post<BrightDataTriggerResponse>(url, inputs, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if (!response.data?.snapshot_id) {
      throw new Error('Failed to retrieve snapshot_id from Bright Data API');
    }

    return response.data.snapshot_id;
  }

  async fetchData(snapshotId: string): Promise<any[]> {
    const url = `${this.apiUrl}/datasets/v3/fetch?snapshot_id=${snapshotId}&format=json`;

    const response = await firstValueFrom(
      this.httpService.get<BrightDataFetchResponse>(url, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      }),
    );

    if (!response.data?.data) {
      throw new Error('Failed to retrieve data from Bright Data API');
    }

    return response.data.data;
  }
}
