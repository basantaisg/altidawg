import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOperatorDto } from "./dto/create-operator.dto";
import { randomBytes } from "crypto";

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async createOperator(dto: CreateOperatorDto) {
    const apiKey = randomBytes(24).toString("hex");
    const operator = await this.prisma.operator.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        apiKey,
      },
    });
    return {
      message: "Operator Created!",
      operatorId: operator.id,
      apiKey: operator.apiKey,
    };
  }

  async findByApiKey(apiKey: string) {
    return this.prisma.operator.findUnique({ where: { apiKey } });
  }
}
