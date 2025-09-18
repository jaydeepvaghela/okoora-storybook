import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { APP_INITIALIZER, Provider } from '@angular/core';

export function setupTranslations(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', {
      'FORMS_ERRORS.fileSizeExceedsForUpload': 'File size exceeds the maximum limit of 5MB',
      'FORMS_ERRORS.fileNotSupported': 'File type not supported'
    });
  };
}

export const translationProviders: Provider[] = [
  TranslateService,
  {
    provide: APP_INITIALIZER,
    useFactory: setupTranslations,
    deps: [TranslateService],
    multi: true
  }
];