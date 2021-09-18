const {
  SSMClient,
  GetParameterCommand,
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

export async function ssmGetParametersByPath(params) {
  const parametersList = [];
  for await (const page of paginateGetParametersByPath(
    paginatorConfig,
    params
  )) {
    parametersList.push(...page.Parameters);
  }
  console.log(parametersList[0]);
  return {
    Keys: [
      {
        name: "Name",
        align: "left",
        field: (item) => item.Name,
        format: (val) => `${val}`,
        sortable: true,
        label: "Name",
      },
      { name: "Value", field: "Value", label: "Value" },
      { name: "Type", field: "Type", label: "Type" },
      {
        name: "LastModifiedDate",
        field: "LastModifiedDate",
        label: "LastModifiedDate",
        format: (val) => `${val}`,
      },
      { name: "Version", field: "Version", label: "Version" },
    ],
    Items: parametersList,
  };
}

export async function ssmGetParameterByName(name, withDecryption) {
  const command = GetParameterCommand({
    Name: name,
    WithDecryption: withDecryption,
  });
  return await client.send(command);
}
