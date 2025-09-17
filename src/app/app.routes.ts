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

export const routes: Routes = [
    {path: '', component:Layout , children:[
        {path :'features', component: Features}
    ]},
    {path: 'signin', component: Signin},
    {path: 'signup', component: Signup},
    {path: 'dashboard', component: Dashboard, children:[
        {path: 'profile', component:Profile},
        {path:'chatbot',component:Chatbot},
        {path: 'doctors', component:Doctors},
        {path: 'emergency', component:Emergency},
        {path: 'tracker', component: Tracker}
    ]}

];
