import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController],
  // Controllers should not be exported; exports are for providers.
})
export class CommonModule {}
