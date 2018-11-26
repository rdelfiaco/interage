import { DashboardOperadorModule } from './dashboard-operador.module';

describe('DashboardOperadorModule', () => {
  let dashboardOperadorModule: DashboardOperadorModule;

  beforeEach(() => {
    dashboardOperadorModule = new DashboardOperadorModule();
  });

  it('should create an instance', () => {
    expect(dashboardOperadorModule).toBeTruthy();
  });
});
