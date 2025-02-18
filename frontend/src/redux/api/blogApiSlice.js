import { apiSlice } from "./apiSlice";
import { BLOG_URL } from "../constants";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (formData) => ({
        url: BLOG_URL,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Blog"],
    }),

    getBlogs: builder.query({
      query: () => BLOG_URL,
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (blogId) => `${BLOG_URL}/${blogId}`,
      providesTags: (result, error, blogId) => [{ type: "Blog", id: blogId }],
    }),

    updateBlog: builder.mutation({
      query: ({ blogId, formData }) => ({
        url: `${BLOG_URL}/${blogId}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { blogId }) => [
        "Blog",
        { type: "Blog", id: blogId },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `${BLOG_URL}/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    getFeaturedBlogs: builder.query({
      query: () => `${BLOG_URL}/featured`,
      providesTags: ["Blog"],
    }),

    getBlogCategories: builder.query({
      query: () => `${BLOG_URL}/categories`,
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetFeaturedBlogsQuery,
  useGetBlogCategoriesQuery,
} = blogApiSlice;