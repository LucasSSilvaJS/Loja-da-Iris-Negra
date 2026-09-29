import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Íris Negra — API da loja')
    .setDescription(
      'Microsserviço da loja da Íris Negra. Catálogo da banda e das peças da Eva, pedidos encaminhados ao WhatsApp, shoutbox e playlist do EP Incognocivo.',
    )
    .setVersion('1.0')
    .addTag('Saúde')
    .addTag('Categorias')
    .addTag('Produtos')
    .addTag('Pedidos')
    .addTag('Chat')
    .addTag('Playlist')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

