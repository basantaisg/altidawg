import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class OperatorGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-operator-key"];
    if (!apiKey)
      throw new UnauthorizedException("Missing x-operator-key header");
    const operator = await this.prisma.operator.findUnique({
      where: { apiKey: String(apiKey) },
    });
    if (!operator) {
      throw new UnauthorizedException("Invalid operator key");
    }
    request.operator = operator;
    return true;
  }
}
