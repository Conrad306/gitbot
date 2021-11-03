/**
 * all information gathered is from https://api.github.com
 */

interface Repository {
    name: string;
    owner: string; //Owner is an object that matches the "User" interface. But i just want its name.
    url: string; // The HTML url, **NOT** the api git one.
    visibility: string; 
    description: string;
    public: boolean;
    commits: number; 
    stars: number; 
    forks: number; 
    issues: number; 
    createdTimestamp: Date;
    languagesUsed: string;
}



interface User {
    username: string; 
    nickname: string; //the name ABOVE the "login" name.
    avatarURL: string; 
    followers: number; //Usually, its a string[], with each name. However, I just want the actual numerical value.
    starred: number; //again, is an array of all values.
    location: string; 
    bio: string; 
    repos: string; 
    createdAt: Date;
}   