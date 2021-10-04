import { PutParameterCommandInput } from "@aws-sdk/client-ssm";

const { SSMClient, PutParameterCommand } = require("@aws-sdk/client-ssm"); // CommonJS import

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

export async function ssmSetParameter(item: any) {
  const params: PutParameterCommandInput = {
    Name: item.Name,
    Value: item.Value,
    Type: item.Type,
    Tier: item.Tier,
    Description: item.Description,
    Tags: item.Tags,
    AllowedPattern: item.AllowedPattern,
    Overwrite: true,
  };
  console.log("ssmSetParameter params:", params);
  const command = new PutParameterCommand(params);
  const response = await client.send(command);
  return response;
}

export async function ssmSetParameters(items: any[]) {
  let promises: Promise<any>[] = [];

  items.forEach((item: any) => {
    const promise = ssmSetParameter(item);
    promises.push(promise);
  });
  console.log("promises", promises);
  const response = await Promise.all(promises);
  console.log("response", response);
  return response;
}
