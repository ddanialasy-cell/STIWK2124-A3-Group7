import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Book } from './book/book';
import { AddBook } from './add-book/add-book';
import { RemoveBook } from './remove-book/remove-book';
import { EditBook } from './edit-book/edit-book';
import { Navbar } from './navbar/navbar';
import { Library } from './library/library';
import { Login } from './login/login';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: '', component: Navbar, children: [
            { path: '', component: Home },
            { path: 'login', component: Login },
            { path: 'library', component: Library },
            {
                path: 'book', component: Book, children: [
                    { path: 'add', component: AddBook, canActivate: [authGuard] },
                    { path: 'remove', component: RemoveBook, canActivate: [authGuard] },
                    { path: 'edit', component: EditBook, canActivate: [authGuard] }
                ]
            }
        ]
    }
];
