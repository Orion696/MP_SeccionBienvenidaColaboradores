declare interface INewPartnerWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListNameFieldLabel: string;
  TitleFieldLabel: string;
  CantidadFieldLabel:string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'NewPartnerWebPartStrings' {
  const strings: INewPartnerWebPartStrings;
  export = strings;
}
