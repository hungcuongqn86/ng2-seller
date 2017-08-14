import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';
import {pspApiUrl} from '../../app.config';

@Injectable()
export class StorefrontsService {
  public storefront: any = {
    id: '',
    title: '',
    desc: '',
    url: {
      domain: '',
      uri: ''
    },
    private: false,
    banner: '',
    campaigns: ''
  };

  public search = {title: '', page_size: 10, page: 1};
  private module = 'stores';

  constructor(public http: HttpClient) {
  }

  checkSuggestion(uri: string, id): any {
    const url = pspApiUrl + `uri`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('check', uri);
    params.set('reference', id);
    return this.http.get(url, {search: params}).map((res: Response) => res.json());
  }

  getDomains(): any {
    const url = pspApiUrl + `domains`;
    return this.http.get(url).map((res: Response) => res.json().domains);
  }

  getDetail(id): any {
    const url = pspApiUrl + this.module + `/${id}`;
    return this.http.get(url).map((res: Response) => res.json());
  }

  suggestion(suggestion: string): any {
    const url = pspApiUrl + `uri`;
    const params: URLSearchParams = new URLSearchParams();
    params.set('suggestion', suggestion);
    return this.http.get(url, {search: params}).map((res: Response) => res.json());
  }

  createStorefronts(storefront: any) {
    const url = pspApiUrl + this.module;
    const body = JSON.stringify(storefront);
    return this.http.post(url, body).map((res: Response) => res.json());
  }

  updateStorefronts(storefront: any) {
    const url = pspApiUrl + this.module + `/${storefront.id}`;
    delete storefront.id;
    delete storefront.state;
    delete storefront.user_id;
    const body = JSON.stringify(storefront);
    return this.http.put(url, body).map((res: Response) => res.json());
  }

  getStorefronts(sparams) {
    const url = pspApiUrl + this.module;
    const params: URLSearchParams = new URLSearchParams();
    Object.keys(sparams).map((key) => {
      params.set(key, sparams[key]);
    });
    return this.http.get(url, {search: params}).map((res: Response) => res.json());
  }
}
