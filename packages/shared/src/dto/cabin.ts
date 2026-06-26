import type { CabinType, WcType } from "../enums";

export interface CabinConfigurationDTO {
  id: string;
  boatId: string;
  cabinType: CabinType;
  wcType: WcType | null;
  quantity: number;
  createdAt: string | Date;
}

export interface CabinConfigurationInput {
  cabinType: CabinType;
  wcType?: WcType | null;
  quantity: number;
}
