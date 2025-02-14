import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import ExperienceChart from './components/ExperienceChart';
import { SPHttpClient } from '@microsoft/sp-http';  

export interface IExperienceChartWebPartProps {
  siteUrl: string;
  spHttpClient: SPHttpClient;  
}

export default class ExperienceChartWebPart extends BaseClientSideWebPart<IExperienceChartWebPartProps> {

  public render(): void {
    // Create the React element and pass the necessary props (siteUrl, spHttpClient)
    const element: React.ReactElement<IExperienceChartWebPartProps> = React.createElement(ExperienceChart, {
      siteUrl: this.context.pageContext.web.absoluteUrl,  // Current site URL
      spHttpClient: this.context.spHttpClient  // SPHttpClient is passed correctly
    });

    // Render the React element into the web part's DOM element
    ReactDom.render(element, this.domElement);
  }
}
