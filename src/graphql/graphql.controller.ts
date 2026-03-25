import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphqlLiteService } from './graphql-lite.service';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

class GraphqlRequestDto {
  query: string;
  variables?: Record<string, unknown>;
}

@ApiTags('graphql-lite')
@PublicAccess()
@Controller('graphql-lite')
export class GraphqlController {
  constructor(private readonly graphqlLiteService: GraphqlLiteService) {}

  @Get()
  @Render('graphql/sandbox')
  sandbox() {
    return {
      pageTitle: 'GraphQL Lite Sandbox',
      schema: this.graphqlLiteService.schema(),
      sampleQuery: `query {
  products(page: 1, limit: 5) {
    data {
      id
      name
      price
      stock
      category {
        id
        name
        brand {
          id
          name
        }
      }
    }
    meta {
      page
      limit
      totalItems
      totalPages
    }
  }
}`,
    };
  }

  @Get('schema')
  @ApiOperation({ summary: 'Get lightweight GraphQL schema SDL' })
  @ApiOkResponse({ schema: { type: 'string' } })
  schema() {
    return this.graphqlLiteService.schema();
  }

  @Post()
  @ApiOperation({ summary: 'Execute a lightweight GraphQL query or mutation' })
  @ApiBody({ type: GraphqlRequestDto })
  execute(@Body() body: GraphqlRequestDto) {
    return this.graphqlLiteService.execute(body.query, body.variables);
  }
}