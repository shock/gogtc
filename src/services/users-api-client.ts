import { User } from 'UserModels';

export function loginUser(login:string, password:string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, 500);
  });
}

export function saveSnapshot(data: User[]): Promise<undefined> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      todos = data;
      resolve();
    }, 500);
  });
}
