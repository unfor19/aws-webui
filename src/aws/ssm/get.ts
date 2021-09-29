import {
  GetParameterHistoryCommandInput,
  GetParameterCommandInput,
  GetParametersByPathCommandInput,
  GetParameterCommand,
} from "@aws-sdk/client-ssm";

const {
  SSMClient,
  paginateGetParameterHistory,
  paginateGetParametersByPath,
} = require("@aws-sdk/client-ssm"); // CommonJS import

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

const paginatorConfig = {
  client: client,
  pageSize: 10, // Max items per API call is 10 - https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_GetParametersByPath.html
};

export async function ssmGetParametersByPath(queryString: string) {
  const params: GetParametersByPathCommandInput = {
    Path: queryString,
    MaxResults: 10,
    Recursive: true,
    WithDecryption: true,
  };
  const parametersList = [];
  for await (const page of paginateGetParametersByPath(
    paginatorConfig,
    params
  )) {
    parametersList.push(...page.Parameters);
  }
  console.log("First item in list:", parametersList[0]);
  return {
    items: parametersList,
  };
}

export async function ssmGetParameterByName(name: string) {
  const params: GetParameterCommandInput = {
    Name: name,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(params);
  const response = await client.send(command);
  return {
    item: response.Parameter,
    metadata: response.$metadata,
  };
}

export async function ssmGetParameterHistory(
  params: GetParameterHistoryCommandInput
) {
  const parameterHistoryList = [];
  for await (const page of paginateGetParameterHistory(
    paginatorConfig,
    params
  )) {
    parameterHistoryList.push(...page.Parameters);
  }
  console.log("First item in list:", parameterHistoryList[0]);
  return {
    items: parameterHistoryList,
  };
}
