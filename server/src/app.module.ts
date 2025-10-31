import { Module } from '@nestjs/common';
import { OperatorModule } from './operator/operator.module';
import { ExperienceModule } from './experience/experience.module';
import { BookingModule } from './booking/booking.module';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [OperatorModule, ExperienceModule, BookingModule, SharedModule, PrismaModule],
})
export class AppModule {}
