import Base from "./base"
export default class FbInstantGameSdk extends Base{
  type: 4
  constructor(config: ExtendedConfig) {
    super();
    this.initConfig(config);
  }
}