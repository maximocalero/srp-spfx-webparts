import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { Log, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'FormSampleWebPartStrings';
import FormSample from './components/FormSample';
import { IFormSampleProps } from './components/IFormSampleProps';
import { MockDataService } from './services/mockDataService';
import { DataService } from './services/DataService';
import { IDataService } from './services/DataServiceInterfaces';

export interface IFormSampleWebPartProps {
  description: string;
}

export default class FormSampleWebPart extends BaseClientSideWebPart<IFormSampleWebPartProps> {

  public render(): void {
    const pageUrl: string = this.context.pageContext.web.absoluteUrl;

    let dataService:IDataService;
    
    if (Environment.type == EnvironmentType.Local){
      dataService = new MockDataService();
    }else if (Environment.type === EnvironmentType.SharePoint){
      dataService = new DataService({
        spHttpClient: this.context.spHttpClient,
        siteAbsoluteUrl: pageUrl,
        context: this.context,
      });  
    }


    const element: React.ReactElement<IFormSampleProps > = React.createElement(
      FormSample,
      {
        description: this.properties.description,
        dataService: dataService,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
