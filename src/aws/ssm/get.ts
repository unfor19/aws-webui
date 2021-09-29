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
  try {
    const params: GetParameterCommandInput = {
      Name: name,
      WithDecryption: true,
    };
    const command = new GetParameterCommand(params);
    const response = await client.send(command);

    const history: any = await ssmGetParameterHistory({
      Name: name,
    });
    const itemsHistory = Array.from(history.items);

    const itemLastHistory = itemsHistory[itemsHistory.length - 1];

    const item: any = {};
    Object.assign(item, response.Parameter);
    Object.assign(item, itemLastHistory);
    item.Value = response.Parameter.Value;
    console.log("item full", item);
    return {
      item: item,
      metadata: response.$metadata,
      history: history,
    };
  } catch (err) {
    console.log("Error setting parameter", err);
    return {
      item: {},
      metadata: err,
      history: {},
    };
  }
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
