import { Injectable, Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
@Injectable({
    providedIn: 'root',
})
export class SidebarComponent implements OnInit {
    @Input() defaultState = true;

    private showNav$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private smallScreen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


    constructor() {}

    ngOnInit(): void {
        this.setSidebar(this.defaultState);
    }

    getSmallScreen() {
        return this.smallScreen$.value;
    }

    setSmallScreen(yesNo: boolean) {
        this.smallScreen$.next(yesNo);
    }

    getShowNav() {
        return this.showNav$.asObservable();
    }

    setSidebar(showHide: boolean) {
        this.showNav$.next(showHide);
    }

    toggleSidebarOpen() {
        this.showNav$.next(!this.showNav$.value);
    }
    isSidebarOpen() {
        return this.showNav$.value;
    }
}
