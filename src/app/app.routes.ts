import { Routes } from '@angular/router';

import { PageMainComponent } from './pages/page-main/page-main.component';
import { PageViewerComponent } from './pages/page-viewer/page-viewer.component';

export const routes: Routes = [
    { path: '', component: PageMainComponent },
    { path: 'viewer/:id', component: PageViewerComponent },
];
