import { Injectable } from "@angular/core";

import { Observable, Subject, fromEvent, of } from "rxjs";
import { switchMap, startWith } from "rxjs/operators";

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

const breakpointsReverseMap = {
  576: "sm",
  768: "md",
  992: "lg",
  1200: "xl",
  1400: "xxl",
};

type Breakpoint = keyof typeof breakpoints;

@Injectable({
  providedIn: "root",
})
export class ViewportService {
  private breakpoint: Observable<Breakpoint>;
  private viewportWidth: Observable<number>;

  get breakpoint$() {
    return this.breakpoint;
  }

  get viewportWidth$() {
    return this.viewportWidth;
  }

  constructor() {
    this.viewportWidth = fromEvent(window, "resize").pipe(
      switchMap((ev: Event) => of((ev.target as Window).innerWidth)),
      startWith(window.innerWidth)
    );
    this.breakpoint = this.viewportWidth.pipe(
      switchMap((width) => {
        let breakpoint: Breakpoint = this.computeBreakpoint(width);
        return of(breakpoint);
      })
    );
  }
  private computeBreakpoint(width: number): Breakpoint {
    if (width < breakpoints["sm"]) {
      return "xs";
    } else if (width < breakpoints["md"]) {
      return "sm";
    } else if (width < breakpoints["lg"]) {
      return "md";
    } else if (width < breakpoints["xl"]) {
      return "lg";
    } else if (width < breakpoints["xxl"]) {
      return "xl";
    } else {
      return "xxl";
    }
  }
}
