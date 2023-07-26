import { Test, TestingModule } from '@nestjs/testing';
import { GuestCodeController } from './guest-code.controller';

describe('GuestCodeController', () => {
  let controller: GuestCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestCodeController],
    }).compile();

    controller = module.get<GuestCodeController>(GuestCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
