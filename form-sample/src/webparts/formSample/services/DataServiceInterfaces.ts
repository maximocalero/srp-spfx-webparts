import { SPHttpClient } from "@microsoft/sp-http";
import { NavigationItem, PageHeaderConfig } from "../common/CommonInterfaces";
import { ItemAddResult } from "@pnp/sp";

export interface IHttpConfiguration{
    spHttpClient: SPHttpClient;
    siteAbsoluteUrl: string;
    context: any;
}

export interface IDataService {
    getNavigation(propertyName: string):Promise<NavigationItem[]>;
    getHeaderConfiguration(pageName: string): Promise<PageHeaderConfig>;
    getSearchResults(query: string): Promise<ISearchResult[]>;
    newFood(food: IFood): Promise<ItemAddResult>;
}

export interface ISearchResult {
    link: string;
    title: string;
    description: string;
    author: string;
}

export interface IFood {
    food: string;
    foodDate: string;
    foodType: string;
}