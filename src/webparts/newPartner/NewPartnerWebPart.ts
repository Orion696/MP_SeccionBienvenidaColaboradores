import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'NewPartnerWebPartStrings';
import NewPartner from './components/NewPartner';
import { INewPartnerProps } from './components/INewPartnerProps';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
export interface INewPartnerWebPartProps {
  description: string;
  ListName: string;
  Cantidad:string;  
}

export default class NewPartnerWebPart extends BaseClientSideWebPart<INewPartnerWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  
    
  protected async onInit(): Promise<void> {
    const  sp =spfi().using(SPFx(this.context));
    const ListTitles:any= await sp.web.lists.filter('Hidden eq false')();
     this._dropdownOptions = ListTitles.map((list) => {
        return {
          key: list.Title,
          text: list.Title
        };
      });
  
    this._environmentMessage = this._getEnvironmentMessage();
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<INewPartnerProps> = React.createElement(
      NewPartner,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context:this.context,
        ListName:this.properties.ListName,
        Count:this.properties.Cantidad
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let message=[]
    message.push(
      PropertyPaneDropdown('ListName', {
        label: strings.ListNameFieldLabel,
        options:this._dropdownOptions
      })
    )
    message.push(
      PropertyPaneTextField('Title', {
        label: strings.TitleFieldLabel
      })
    );
   
    message.push(
      PropertyPaneSlider('Cantidad', {
        label: strings.CantidadFieldLabel,
        min:4,
        max:20,        
      })
    )
    
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: message
            }
          ]
        }
      ]
    };
  }
  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   return {
  //     pages: [
  //       {
  //         header: {
  //           description: strings.PropertyPaneDescription
  //         },
  //         groups: [
  //           {
  //             groupName: strings.BasicGroupName,
  //             groupFields: [
  //               PropertyPaneTextField('description', {
  //                 label: strings.DescriptionFieldLabel
  //               })
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }
}
