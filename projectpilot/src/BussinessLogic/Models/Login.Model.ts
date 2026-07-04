export interface LoginModel {
    id: number;
    firstName: string;
    username: string;
    role: number;
    token: string;
    created: string;
    isActive: boolean;
    picture: string;
    success: boolean;
    message: string;
    hasMissingDetails: boolean;
}

export function createLoginModel(raw: any): LoginModel {
    return {
        id: raw.id,
        firstName: raw.firstName,
        username: raw.username,
        role: raw.role,
        token: raw.token,
        created: raw.created,
        isActive: raw.isActive,
        picture: raw.picture,
        success: raw.success,
        message: raw.message,
        hasMissingDetails: raw.hasMissingDetails
    };
}

