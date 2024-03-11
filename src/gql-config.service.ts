import { GraphQLRequest } from '@apollo/server'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { GraphqlConfig } from './common/configs/config.interface'

type OriginalError = {
  message: Array<string>
  statusCode: number
  error: string
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql')
    return {
      // schema options
      autoSchemaFile:
        graphqlConfig?.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig?.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      // subscription
      subscriptions: {
        'graphql-ws': true,
      },
      includeStacktraceInErrorResponses: graphqlConfig?.debug,
      playground: graphqlConfig?.playgroundEnabled,
      formatError: (error) => {
        const originalError = error.extensions?.originalError as OriginalError

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          }
        }

        const concatenatedMessages = Array.isArray(originalError.message)
          ? originalError.message.join('; ')
          : originalError.message
        return {
          message: concatenatedMessages,
          code: error.extensions?.code,
        }
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }: { req: GraphQLRequest }) => ({ req }),
    }
  }
}
