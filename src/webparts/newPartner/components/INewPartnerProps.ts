import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INewPartnerProps {
  description: string;
  ListName:string;
  Count:string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context:WebPartContext;
}
