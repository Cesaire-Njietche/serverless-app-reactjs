import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
} from 'aws-lambda'
import 'source-map-support/register'

import { verify,  } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-miicy1yk.us.auth0.com/.well-known/jwks.json'

// const certificate = "-----BEGIN CERTIFICATE-----\
// MIIDDTCCAfWgAwIBAgIJE5vSYBF2E6yZMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV\
// BAMTGWRldi1taWljeTF5ay51cy5hdXRoMC5jb20wHhcNMjIxMDE1MDQzNDIxWhcN\
// MzYwNjIzMDQzNDIxWjAkMSIwIAYDVQQDExlkZXYtbWlpY3kxeWsudXMuYXV0aDAu\
// Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArpnlib+eUDP02FmR\
// ULqcnp5tuWXBS6IdEZPF/HhtnU/4xvJxukuqYmuWgE/4efRcGwXVgKyBfz5cXSiv\
// jl7CA2pwK9ks7scPJAXjxfDhR8OgutSV/owNBzW3+cZO0ENr8QkfwREBLCCbNe/F\
// uLXdVCKwErmDEXb7t4NLCt8VAkVil71xN8T4fksldGw6Qx9Opd3ZsYpAzH14YJPH\
// WwzdRjDg5+66SXOhK5Vwn+PUfz8pTQKt79PipDrHNtkjUtKkBg3ias+zC8GC8g5D\
// LFc91OPC0QWsimX02vd0bMKjkS1T0SXNdXFYihCSzF7AGlsedZ5om7FK2vjpJSxW\
// Fvq/LwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSC0QovEre0\
// ZLk11rRC7naPcbf71zAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB\
// AImYrHYkwmHpVkILcFLTqgoU3DVoD4WV9XN7EZ82Nh89FNNoUEpn1LEvJ/pPpY4u\
// 3qFtIyBb3kFk/GjjFG5IKeTHPK4GwGxY3uGRe2uLZJzvauSz0oNY/3B218AbtcRy\
// l5n7kM58xsuepmPHrhBS75UBMn2eN45/+/jUjD9lVDf/CPORRzySLSyY9Idvanp3\
// Xq9XJRkuVYz0WeHBVqmDdQn1qZodCv2FiOb8GIwSdp+615a4/VYxb2mWV9AJDLah\
// 1sZgxPFP3YYrUqyLmpeilrjhh10FYM4yEwmIRg+h0ghOx8U8M+G56DA5fF+MB/bR\
// 0i/N0S+T6YY0IKi3PVDjd/Q=\
// -----END CERTIFICATE-----";

const secret = process.env.AUTH_0_SECRET;

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // const cert = (await Axios.get(jwksUrl)).data.keys[0]['x5c'][0] as string
  // console.log(cert)
  console.log(token)
  
  return verify(token, secret) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
