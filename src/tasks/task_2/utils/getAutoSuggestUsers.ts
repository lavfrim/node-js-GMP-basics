import { AutoSuggestUsersOption, User } from '../types';

export const getAutoSuggestUsers = ({ userDataBase, loginSubstring, limit }: AutoSuggestUsersOption): User[] => {
    return (
        userDataBase
            .filter((profile) => profile.login.includes(loginSubstring))
            .sort((pre, next) => {
                if (pre.login > next.login) {
                    return 1;
                }
                if (pre.login < next.login) {
                    return -1;
                }

                return 0;
            })
            .slice(0, limit)
    );
};
