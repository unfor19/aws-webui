import {
  GetParameterCommandInput,
  GetParameterHistoryCommandInput,
} from "@aws-sdk/client-ssm";

const {
  SSMClient,
  GetParameterCommand,
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

export async function ssmGetParametersByPath(params: GetParameterCommandInput) {
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

export async function ssmGetParameterByName(
  name: String,
  withDecryption: Boolean
) {
  const command = GetParameterCommand({
    Name: name,
    WithDecryption: withDecryption,
  });
  return await client.send(command);
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
