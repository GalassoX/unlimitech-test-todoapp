import { makeAutoObservable } from "mobx";

class UserStore {
  private _user!: User;

  constructor() {
    makeAutoObservable(this);
  }
  
  public setUser(data: User) {
    this._user = data;
  }

  public get user(): User {
    return this._user;
  }
  
}

export const userStore = new UserStore();