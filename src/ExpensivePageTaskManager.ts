import { comparer, computed, observable, ObservableMap, reaction } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { Page } from "./Document";

export class PageTask {
  private _promise: IPromiseBasedObservable<string> | undefined;
  constructor(readonly pageState: string) {}

  set promise(promise: Promise<string>) {
    this._promise = fromPromise(promise, this._promise);
  }

  @computed
  get state() {
    return this._promise?.state ?? "errored";
  }

  @computed
  get result(): string | undefined {
    return this._promise?.case({
      fulfilled: (result) => result,
    });
  }
}

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
    const pageTask = this.pageTaskMap.get(page) ?? new PageTask(pageState);

    pageTask.promise = promise;

    this.pageTaskMap.set(page, pageTask);
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
