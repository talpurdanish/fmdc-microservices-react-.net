export interface IStorageService {
    set<T>(key: string, value: T): void;
    get<T>(key: string): T | null;
    remove(key: string): void;
    clear(): void;
}

export class GlobalStorageService implements IStorageService {
    clear(): void {
        sessionStorage.clear();
    }
    set<T>(key: string, value: T) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    get<T>(key: string): T | null {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    remove(key: string) {
        sessionStorage.removeItem(key);
    }
}

export class UserScopedStorageService implements IStorageService {
    private userId: number;
    constructor(userId: number) {
        this.userId = userId;
    }
    clear(): void {
        sessionStorage.clear();
    }

    private buildKey(key: string): string {
        return `${this.userId}_${key}`;
    }

    set<T>(key: string, value: T) {
        sessionStorage.setItem(this.buildKey(key), JSON.stringify(value));
    }
    get<T>(key: string): T | null {
        const item = sessionStorage.getItem(this.buildKey(key));
        return item ? JSON.parse(item) : null;
    }
    remove(key: string) {
        sessionStorage.removeItem(this.buildKey(key));
    }
}