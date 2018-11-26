import { DashboardSupervisorModule } from './dashboard-supervisor.module';

describe('DashboardSupervisorModule', () => {
  let dashboardSupervisorModule: DashboardSupervisorModule;

  beforeEach(() => {
    dashboardSupervisorModule = new DashboardSupervisorModule();
  });

  it('should create an instance', () => {
    expect(dashboardSupervisorModule).toBeTruthy();
  });
});
