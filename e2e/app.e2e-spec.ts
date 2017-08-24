import { Ng2SellerPage } from './app.po';

describe('ng2-seller App', () => {
  let page: Ng2SellerPage;

  beforeEach(() => {
    page = new Ng2SellerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
