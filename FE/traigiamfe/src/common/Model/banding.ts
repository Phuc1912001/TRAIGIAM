import EntryIcon from "../../assets/svg/entry.svg";
import BronzeIcon from "../../assets/svg/bzone.svg";
import SilverIcon from "../../assets/svg/silver.svg";
import GoldIcon from "../../assets/svg/gold.svg";
import DiamondIcon from "../../assets/svg/diamond.svg";

export interface BandingModel {
  id?: number;
  bandingID?: number;
  desc?: string;
  status?: boolean;
}

export const enum BandingEnum {
  Entry = 10,
  Bronze = 20,
  Silver = 30,
  Gold = 40,
  Diamond = 50,
}

export const IBandingMap = new Map<BandingEnum, string>([
  [BandingEnum.Entry, EntryIcon],
  [BandingEnum.Bronze, BronzeIcon],
  [BandingEnum.Silver, SilverIcon],
  [BandingEnum.Gold, GoldIcon],
  [BandingEnum.Diamond, DiamondIcon],
]);

export const IBandingTextMap = new Map<BandingEnum, string>([
  [BandingEnum.Entry, "Người Mới"],
  [BandingEnum.Bronze, "Đồng"],
  [BandingEnum.Silver, "Bạc"],
  [BandingEnum.Gold, "Vàng"],
  [BandingEnum.Diamond, "Kim Cương"],
]);
