import { DashboardAdminModule } from './dashboard-admin.module';

describe('DashboardModule', () => {
  let dashboardModule: DashboardAdminModule;

  beforeEach(() => {
    dashboardModule = new DashboardAdminModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
