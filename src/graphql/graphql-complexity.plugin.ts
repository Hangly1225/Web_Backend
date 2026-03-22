import { ApolloServerPlugin } from '@apollo/server';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

export class GraphqlComplexityPlugin implements ApolloServerPlugin {
  private readonly maxComplexity = 50;

  async requestDidStart() {
    return {
      didResolveOperation: async (requestContext) => {
        const complexity = getComplexity({
          schema: requestContext.schema,
          query: requestContext.document,
          operationName: requestContext.request.operationName,
          variables: requestContext.request.variables ?? {},
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity > this.maxComplexity) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${this.maxComplexity}`,
          );
        }
      },
    };
  }
}