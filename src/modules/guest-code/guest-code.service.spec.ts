import { Test, TestingModule } from '@nestjs/testing';
import { GuestCodeService } from './guest-code.service';

describe('GuestCodeService', () => {
  let service: GuestCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestCodeService],
    }).compile();

    service = module.get<GuestCodeService>(GuestCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
