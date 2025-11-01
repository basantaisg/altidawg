import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("AltidawG API")
    .setDescription("API documentation for AltidawG travel platform")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.enableCors({
    origin: [
      "http://localhost:8080", // Vite default (if you changed)
      "http://127.0.0.1:8080",
      "http://localhost:5173", // Vite default
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-operator-key"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204, // what you see in the screenshot
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
