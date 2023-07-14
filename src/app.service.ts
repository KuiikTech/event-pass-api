import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      apiName: process.env.API_NAME,
      apiDescription: process.env.API_DESCRIPTION,
      apiVersion: process.env.npm_package_version,
    };
  }
}
