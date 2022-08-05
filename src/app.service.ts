import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Parse from 'parse/node';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
  ){
    this.ParseServerConfiguration();
  }
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Function to configure ParseSDK
   */
   private ParseServerConfiguration(): void {
    Parse.initialize(
      this.configService.get<string>('BACK4APP_APPLICATION_ID'),
      this.configService.get<string>('BACK4APP_JAVASCRIPT_KEY'),
      this.configService.get<string>('BACK4APP_MASTER_KEY'),
    );
    (Parse as any).serverURL = this.configService.get<string>(
      'BACK4APP_SERVER_URL',
    );
  }
}
