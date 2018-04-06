import { LabtracUiPage } from './app.po';

describe('labtrac-ui App', () => {
  let page: LabtracUiPage;

  beforeEach(() => {
    page = new LabtracUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
