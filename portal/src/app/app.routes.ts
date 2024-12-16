import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PortalLayoutComponent } from './layouts/portal-layout/portal-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { RolesComponent } from './pages/roles/roles.component';
import { UsersComponent } from './pages/users/users.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinInComponent } from './pages/join-in/join-in.component';
import { GuardianSignupComponent } from './pages/guardian-signup/guardian-signup.component';
import { StudentSignupComponent } from './pages/student-signup/student-signup.component';
import { TeacherSignupComponent } from './pages/teacher-signup/teacher-signup.component';
import { BrowseClassesComponent } from './pages/browse-classes/browse-classes.component';
// import { ClassDetailsComponent } from './pages/class-details/class-details.component';
import { AddClassComponent } from './pages/add-class/add-class.component';
import { AddSubjectComponent } from './pages/add-subject/add-subject.component';
import { AddTopicComponent } from './pages/add-topic/add-topic.component';
import { AddChapterComponent } from './pages/add-chapter/add-chapter.component';
import { TeacherScheduleComponent } from './pages/teacher-schedule/teacher-schedule.component';
import { ExploreClassesComponent } from './pages/explore-classes/explore-classes.component';
import { StudentChapterComponent } from './pages/student-chapter/student-chapter.component';

export const routes: Routes = [
    {
        path: '',
        component: JoinInComponent,
        data: { title: 'Home' },
    },
    {
        path: 'join-in',
        component: HomeComponent,
        data: { title: 'About Ankurshala' },
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' },
    },
    {
        // path: 'create-account',
        path: 'sign-up',
        component: SignUpComponent,
        data: { title: 'Sign Up' },
    },

    {
        path:'guardian-signup',
        component: GuardianSignupComponent,
        data: {title:'Guardian Sign Up'},
    },
    {
        path:'student-signup',
        component: StudentSignupComponent,
        data: {title:'Student Sign Up'},
    },
    {
        path:'teacher-signup',
        component: TeacherSignupComponent,
        data: {title:'Teacher Sign Up'},
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot Password' }
    },
    {
        path: '',
        component: PortalLayoutComponent,
        canActivateChild: [authGuard],
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: { title: 'Dashboard' }
            },
            {
                path: 'roles',
                component: RolesComponent,
                data: { title: 'Roles' }
            },
            {
                path: 'users',
                component: UsersComponent,
                data: { title: 'Users' }
            },
            {
                path: 'browse-classes/:topicId',
                component: BrowseClassesComponent,
                data: { title: 'Browse Classes' }
            },
            // {
            //     path: 'class-details',
            //     component: ClassDetailsComponent,
            //     data: { title: 'Class Details' }
            // },
            {
                path: 'profile',
                component: ProfileComponent,
                data: { title: 'Profile' }
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: { title: 'Settings' }
            },
            {
                path: 'addClass',
                component: AddClassComponent,
                data: { title: 'Add Class' }
            },
            {
                path: 'addSubject',
                component: AddSubjectComponent,
                data: { title: 'Add Subject' }
            },
            {
                path: 'addTopic',
                component: AddTopicComponent,
                data: { title: 'Add Topic' }
            },
            {
                path: 'addChapter',
                component: AddChapterComponent,
                data: { title: 'Add Chapter' }
            },
             {
                path: 'teacherSchedule',
                component: TeacherScheduleComponent,
                data: { title: 'Teacher Schedule' }
            },
            {
                path: 'exploreClasses',
                component: ExploreClassesComponent,
                data: { title: 'Explore Class' }
            },
            {
                path: 'studentChapter/:subjectId',
                component: StudentChapterComponent,
                data: { title: 'Student Chapter'}
            }
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        data: { title: 'Page Not Found' },
    }
];
