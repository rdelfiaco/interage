import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AutocompleteModule } from './autocomplete/ng2-completer.module';
import { CardsModule } from './cards/cards.module';
import { FileInputModule } from './file-input/module/mdb-uploader.module';
import { MaterialChipsModule } from './tags/chips.module';
import { ProgressBars } from './progressbars/index';
import { TabsModule } from './tabs-pills/tabset.module';
import { SelectModule } from './material-select/select.module';
import { DatepickerModule } from './date-picker/datepicker.module';
import { TimePickerModule } from './time-picker/timepicker.module';
import { LightBoxModule } from './lightbox/light-box.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ChartSimpleModule } from './easy-charts/chart-simple.module';
import { AccordionModule } from './accordion/index';
import { StickyContentModule } from './sticky-content/sticky-content.module';
import { SmoothscrollModule } from './smoothscroll/index';
import { CharCounterModule } from './inputs/char-counter.module';



export {
  AutocompleteModule, CompleterComponent, CompleterListItemComponent, CompleterService, LocalDataFactoryProvider,
  RemoteDataFactoryProvider, MdbCompleterDirective, MdbDropdownDirective, MdbInputCompleteDirective, MdbListDirective, MdbRowDirective
} from './autocomplete/index';

export {
  CardsModule, CardRotatingComponent, CardRevealComponent
} from './cards/index';

export {

  ProgressbarComponent, ProgressbarConfigComponent, ProgressbarModule, ProgressBars, ProgressDirective,
  ProgressSpinnerComponent, BarComponent
} from './progressbars/index';

export {
  MaterialChipsComponent, MaterialChipsModule
} from './tags/index';

export {
  TabDirective, TabHeadingDirective, TabsetComponent, TabsetConfig, TabsModule, NgTranscludeDirective
} from './tabs-pills/index';

export {
  MDBSpinningPreloader
} from './preloader/preloader.service';

// export {
//   ToastComponent, ToastContainerDirective, ToastContainerModule, ToastInjector, ToastPackage, ToastRef, ToastIconClasses,
//   ToastModule, ToastService, GlobalConfig, IndividualConfig, Overlay, OVERLAY_PROVIDERS, OverlayContainer, OverlayRef
// } from './alerts/';

export {
  SelectModule, Diacritics, Option, OptionList, IOption, SELECT_VALUE_ACCESSOR, SelectComponent, SelectDropdownComponent
} from './material-select/index';

export {
  MDBDatePickerComponent, DatepickerModule, IMyCalendarDay, IMyCalendarViewChanged, IMyDate, IMyDateModel, IMyDateRange,
  IMyDayLabels, IMyInputAutoFill, IMyInputFieldChanged, IMyInputFocusBlur, IMyLocales, IMyMarkedDate, IMyMarkedDates,
  IMyMonth, IMyMonthLabels, IMyOptions, IMyWeek, IMyWeekday, InputAutoFillDirective, MYDP_VALUE_ACCESSOR, UtilService,
  LocaleService, FocusDirective
} from './date-picker/index';

export {
  TimePickerModule, ClockPickerComponent
} from './time-picker/index';

export { LightBoxModule, ImageModalComponent } from './lightbox/index';

export {
  SidenavComponent, SidenavModule
} from './sidenav/index';

export {
  ChartSimpleModule, EasyPieChartComponent, SimpleChartComponent
} from './easy-charts/index';

export {
  SBItemComponent, SBItemBodyComponent, SBItemHeadComponent, SqueezeBoxComponent, AccordionModule
} from './accordion/index';

export {
  MdbStickyDirective, StickyContentModule
} from './sticky-content/index';

export {
  SmoothscrollModule, PageScrollDirective, PageScrollConfig, PageScrollingViews, PageScrollInstance, PageScrollService,
  PageScrollTarget, PageScrollUtilService, EasingLogic
} from './smoothscroll/index';

export {
  CharCounterDirective, CharCounterModule
} from './inputs/index';

export {
  MDBFileDropDirective, MDBFileSelectDirective, FileInputModule, MDBUploaderService, UploadFile, UploadOutput,
  UploadInput, humanizeBytes
} from './file-input/index';

const MODULES = [
  AutocompleteModule,
  CardsModule,
  FileInputModule,
  MaterialChipsModule,
  ProgressBars,
  TabsModule,
  SelectModule,
  DatepickerModule,
  TimePickerModule,
  LightBoxModule,
  SidenavModule,
  ChartSimpleModule,
  AccordionModule,
  StickyContentModule,
  SmoothscrollModule,
  CharCounterModule,
];

@NgModule({
  imports: [
    AutocompleteModule,
    CardsModule.forRoot(),
    MaterialChipsModule,
    ProgressBars.forRoot(),
    TabsModule.forRoot(),
    SelectModule,
    DatepickerModule,
    TimePickerModule,
    LightBoxModule,
    SidenavModule,
    ChartSimpleModule,
    AccordionModule,
    StickyContentModule,
    SmoothscrollModule.forRoot(),
    CharCounterModule.forRoot(),
  ],
  exports: [MODULES],
  providers: [
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MDBRootModulePro {
}

@NgModule({ exports: MODULES })
export class MDBBootstrapModulePro {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: MDBRootModulePro };
  }
}
