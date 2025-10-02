import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Signin } from './layout/signin/signin';
import { Features } from './layout/features/features';
import { Signup } from './layout/signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './dashboard/profile/profile';
import { Chatbot } from './dashboard/chatbot/chatbot';
import { Doctors } from './dashboard/doctors/doctors';
import { Emergency } from './dashboard/emergency/emergency';
import { Tracker } from './dashboard/tracker/tracker';
import { Main } from './dashboard/main/main';
import { MedicalRecord } from './dashboard/medical-record/medical-record';
import { Notifications } from './dashboard/notifications/notifications';
import { Contactus } from './dashboard/contactus/contactus';
import { Educational } from './dashboard/educational/educational';
import { Meals } from './dashboard/meals/meals';

export const routes: Routes = [
    {path: '', component:Layout},
    {path: 'signin', component: Signin},
    {path: 'signup', component: Signup},
    {path: 'dashboard', component: Dashboard, children:[
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        {path:'main', component:Main},
        {path: 'profile', component:Profile},
        {path:'chatbot',component:Chatbot},
        {path: 'doctors', component:Doctors},
        {path: 'emergency', component:Emergency},
        {path: 'tracker', component: Tracker},
        {path:'test',component:MedicalRecord},
        {path:'notifications',component:Notifications},
        {path:'contactus', component:Contactus},
        {path:'learning',component:Educational},
        {path:'meal',component:Meals}
    ]}

];
