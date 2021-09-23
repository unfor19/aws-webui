const { SSMClient, DeleteParametersCommand } = require("@aws-sdk/client-ssm"); // CommonJS import

const client = new SSMClient({
  apiVersion: "2014-11-06",
  // Hardcoded region and credentials for localstack
  region: "us-east-1",
  credentials: {
    accessKeyId: "mock_aws",
    secretAccessKey: "mock_aws",
  },
  endpoint: "http://localhost:4566",
});

export async function ssmDeleteParametersByNames(params) {
  const command = new DeleteParametersCommand(params);
  const response = await client.send(command);
  return response;
}
