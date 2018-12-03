import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { IHttpConfiguration, IDataService, ISearchResult, IFood } from './DataServiceInterfaces';
import { NavigationItem, PageHeaderConfig } from '../common/CommonInterfaces';
import { StringConstants } from '../common/StringConstants';
import { setup as pnpSetup } from '@pnp/common';
import { sp, StorageEntity, SearchQueryBuilder, ItemAddResult } from '@pnp/sp';

export class DataService implements IDataService{
    private spHttpClient: SPHttpClient;
    private siteAbsoluteUrl: string;
    private formDigest: string;
    private context:any;

    constructor(config: IHttpConfiguration){
        this.spHttpClient = config.spHttpClient;
        this.siteAbsoluteUrl = config.siteAbsoluteUrl;
        this.context = config.context;

        pnpSetup({
            spfxContext: this.context,
        });

        sp.setup({
            spfxContext: this.context
        });
    }

    public async getNavigation(propertyName: string):Promise<NavigationItem[]>{
        const jsonTenantProperty:StorageEntity = await sp.web.getStorageEntity(propertyName);
        let globalNavigation:NavigationItem[] = JSON.parse(jsonTenantProperty.Value);

        return globalNavigation;
    }

    public async getHeaderConfiguration(pageName: string): Promise<PageHeaderConfig> {
        const jsonTenantProperty:StorageEntity = await sp.web.getStorageEntity(StringConstants.PagesHeaderConfigurationKey);
        const pagetHeaderConfArray: PageHeaderConfig[] = JSON.parse(jsonTenantProperty.Value);

        const pageHeaderConf: PageHeaderConfig[] = pagetHeaderConfArray.filter(pageConf => pageConf.pageName === pageName);

        return pageHeaderConf[0];
    }

    public async getSearchResults(query: string): Promise<ISearchResult[]> {
        let results: ISearchResult[] = [];
        const queryPath: string = "ContentType=Meal";
        const queryText: string = `${queryPath} ${query}`;
        const searchResults = await sp.search({
            Querytext: queryText,
            RowLimit: 10,
            StartRow: 0,
            
        });

        if (searchResults.PrimarySearchResults.length > 0) {
            searchResults.PrimarySearchResults.forEach(result=>{
                results.push({
                    title: result.Title,
                    description: result.HitHighlightedSummary,
                    link: result.Path,
                    author: result.Author
                });
            });
        }
        return results;
    }

    public async newFood(food: IFood): Promise<ItemAddResult> {
        return new Promise<ItemAddResult>((resolve, reject)=>         
        sp.site.rootWeb.lists.getByTitle("Comidas").items.add({
            Title: food.food,
            FechaComida: food.foodDate,
            TipoComida: food.foodType,
        }).then((addResult: ItemAddResult)=>{
            resolve(addResult);
        },(error:any):void=>{
            reject("Item Add error");
        }));
    }
}