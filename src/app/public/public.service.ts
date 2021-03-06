import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import {HttpClient} from '../lib/http';
import {pspApiUrl} from '../app.config';

@Injectable()
export class PublicService {
  showsidebar = true;

  constructor(public http: HttpClient) {

  }

  public getConfig(key) {
    const url = pspApiUrl + 'preferences';
    const params: URLSearchParams = new URLSearchParams();
    params.set('key', key);
    return this.http.get(url, {search: params}).map((res: Response) => res.json().value);
  }

  public getBases(type_id): any {
    const url = pspApiUrl + `bases`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('type_id', type_id);
    return this.http.get(url, {search: params}).map((res: Response) => res.json().bases);
  }

  public getBaseTypes(): any {
    const url = pspApiUrl + `base_groups`;
    return this.http.get(url).map((res: Response) => res.json().base_groups);
  }

  public getMockupCategories(): any {
    const url = pspApiUrl + `mockup_categories`;
    return this.http.get(url).map((res: Response) => res.json().mockup_categories);
  }

  public getMockupTypes(): any {
    const url = pspApiUrl + `mockup_types`;
    return this.http.get(url).map((res: Response) => res.json().mockup_types);
  }

  public getMockupTemplates(type, cat) {
    const url = pspApiUrl + `mockup_templates`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('type', type);
    params.set('categories', cat);
    return this.http.get(url, {search: params}).map((res: Response) => res.json().templates);
  }

  public getCampaigns(sparams) {
    const url = pspApiUrl + 'campaigns';
    const params: URLSearchParams = new URLSearchParams();
    Object.keys(sparams).map((key) => {
      params.set(key, sparams[key]);
    });
    return this.http.get(url, {search: params}).map((res: Response) => res.json());
  }
}
