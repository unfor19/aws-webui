import { RouteParamsRaw } from "vue-router";

interface IService {
  Title: string;
  RouteName: string;
  Description?: string;
  BtnCreate?: boolean;
}

class ServiceClass {
  public Title: string = "";
  public RouteName: string = "";
  public Description: string = "";
  public BtnCreate: boolean = false;
}

export function servicesValidator(services: IService[]): boolean {
  let isValid = true;
  const interfaceObject = new ServiceClass();
  const interfaceKeysArray: Array<string> = Object.keys(interfaceObject);
  services.forEach((service: IService) => {
    Object.keys(service).forEach((serviceKey: any) => {
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

interface IEditable {
  type: "textarea" | "select";
  data: any;
  default: "";
}

export interface IKey {
  name: string;
  label: string;
  field?: string;
  format?: any;
  sortable?: false;
  editable?: IEditable | [];
  rules?: [];
  align?: string | "";
}

class KeyClass {
  public name: string = "";
  public label: string = "";
  public field?: string = "";
  public format?: any = "";
  public sortable?: boolean = false;
  public editable?: IEditable = <IEditable>{};
  public rules?: [];
  public align?: string = "";
}

export function keysValidator(keys: IKey[]): boolean {
  let isValid = true;
  const interfaceObject = new KeyClass();
  const interfaceKeysArray: Array<string> = Object.keys(interfaceObject);
  keys.forEach((key: IKey) => {
    Object.keys(key).forEach((objectKey: any) => {
      if (interfaceKeysArray.indexOf(objectKey) < 0) {
        throw new Error(
          `${objectKey} Key is not in interface ${JSON.stringify(
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

export interface IModifyParams extends RouteParamsRaw {
  items: any[];
}
