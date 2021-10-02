type TService = {
  Title: string;
  RouteName: string;
  Description?: string;
  BtnCreate?: boolean;
};

class ServiceClass {
  public Title: string = "";
  public RouteName: string = "";
  public Description: string = "";
  public BtnCreate: boolean = false;
}

export function servicesValidator(services: TService[]): boolean {
  let isValid = true;
  const interfaceObject = new ServiceClass();
  const interfaceKeysArray: Array<string> = Object.keys(interfaceObject);
  services.forEach((service: TService) => {
    Object.keys(service).forEach((serviceKey: any) => {
      // console.log("serviceKey:", serviceKey);
      // console.log("interfaceKeysArray:", interfaceKeysArray);
      if (interfaceKeysArray.indexOf(serviceKey) < 0) {
        throw new Error(
          `${serviceKey} Key is not in interface ${JSON.stringify(
            interfaceKeysArray,
            null,
            2
          )}`
        );
      }
    });
  });
  return isValid;
}
