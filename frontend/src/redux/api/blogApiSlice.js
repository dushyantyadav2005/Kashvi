import { apiSlice } from "./apiSlice";
import { BLOGS_URL } from "../constants";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: () => ({ url: BLOGS_URL }),
    }),
    
    useCreateBlog: builder.mutation({
      query: (blogData) => ({
        url: BLOGS_URL,
        method: "POST",
        body: blogData,
      }),
    }),
    
    useUpdateBlog: builder.mutation({
      query: ({ blogId, blogData }) => ({
        url: `${BLOGS_URL}/${blogId}`,
        method: "PUT",
        body: blogData,
      }),
    }),
    
    useDeleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `${BLOGS_URL}/${blogId}`,
        method: "DELETE",
      }),
    }),
    
    fetchBlogById: builder.query({
      query: (blogId) => ({ url: `${BLOGS_URL}/${blogId}` }),
    }),
  }),
});

export const { 
  useFetchBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useFetchBlogByIdQuery
} = blogApiSlice;
