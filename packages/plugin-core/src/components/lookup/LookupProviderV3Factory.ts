import {
  ILookupProviderOptsV3,
  ILookupProviderV3,
  INoteLookupProviderFactory,
  ISchemaLookupProviderFactory,
} from "./LookupProviderV3Interface";
import { SchemaLookupProvider } from "./SchemaLookupProvider";
import { NoteLookupProvider } from "./NoteLookupProvider";
import { IMyceliumExtension } from "../../myceliumExtensionInterface";

export class NoteLookupProviderFactory implements INoteLookupProviderFactory {
  private extension: IMyceliumExtension;

  constructor(extension: IMyceliumExtension) {
    this.extension = extension;
  }

  create(id: string, opts: ILookupProviderOptsV3) {
    return new NoteLookupProvider(id, opts, this.extension);
  }
}

export class SchemaLookupProviderFactory
  implements ISchemaLookupProviderFactory
{
  private extension: IMyceliumExtension;

  constructor(extension: IMyceliumExtension) {
    this.extension = extension;
  }

  create(id: string, opts: ILookupProviderOptsV3): ILookupProviderV3 {
    return new SchemaLookupProvider(id, opts, this.extension);
  }
}
