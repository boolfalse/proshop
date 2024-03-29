
import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: "POST",
                body: data,
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
            }),
        }),
        adminGetUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}/list`,
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5,
        }),
        adminDeleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/user/${userId}`,
                method: 'DELETE',
            }),
            // providesTags: ['User'],
            invalidatesTags: ['User'],
        }),
        adminGetUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/user/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        adminUpdateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/user/${data._id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useAdminGetUsersQuery,
    useAdminDeleteUserMutation,
    useAdminGetUserDetailsQuery,
    useAdminUpdateUserMutation,
} = usersApiSlice;
