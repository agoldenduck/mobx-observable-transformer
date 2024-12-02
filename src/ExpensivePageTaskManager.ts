import { comparer, ObservableMap, reaction } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { Page } from "./types/Document";

export type PageTask = IPromiseBasedObservable<string>;

export class ExpensivePageTaskManager {
  pageTaskMap = new ObservableMap<Page, PageTask>();

  startListeningToChanges(page: Page): (() => void) | undefined {
    return reaction(
      () => page,
      (page) => this.triggerExpensivePageTask(page),
      {
        fireImmediately: true,
        delay: 500,
        equals: comparer.structural,
      }
    );
  }

  private triggerExpensivePageTask(page: Page) {
    const pageState = JSON.stringify(page);
    const promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        resolve(pageState.repeat(2));
      }, 5000);
    });

    let oldPromise = this.pageTaskMap.get(page);

    this.pageTaskMap.set(page, fromPromise(promise, oldPromise));
  }

  getPageTaskResult(page: Page): PageTask {
    let pageTask = this.pageTaskMap.get(page);
    if (!pageTask) {
      this.startListeningToChanges(page);
      return this.getPageTaskResult(page);
    }
    return pageTask;
  }
}
