import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleUp = keyframes`
  from { transform: scale(0.95); }
  to { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled Components
const BlogGrid = styled.div`
  padding: 4rem 2rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #f1f3f5 100%);
  min-height: 100vh;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeIn} 0.6s ease-out, ${scaleUp} 0.6s ease-out;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px) rotateX(2deg) rotateY(2deg);
    box-shadow: 0 15px 45px rgba(0,0,0,0.15);
  }
`;

const ImageContainer = styled.div`
  height: 250px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #f6f7f8 25%, #e9ebee 50%, #f6f7f8 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  
  ${BlogCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CategoryTag = styled.span`
  background: ${props => getCategoryColor(props.category)};
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const BlogTitle = styled.h2`
  font-size: 1.4rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.3;
  transition: color 0.3s ease;
  
  ${BlogCard}:hover & {
    color: #6c5ce7;
  }
`;

const BlogExcerpt = styled.p`
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #5b4bc4;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  &::after {
    content: "";
    width: 50px;
    height: 50px;
    border: 3px solid rgba(108,92,231,0.2);
    border-top-color: #6c5ce7;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const PageHeading = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3436;
  position: relative;
  animation: ${slideIn} 0.6s ease-out;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: #6c5ce7;
  }
`;

// Helper function for category colors
const getCategoryColor = (category) => {
  const colors = {
    styling: '#ff7675',
    'fabric-care': '#00b894',
    'fashion-trends': '#6c5ce7'
  };
  return colors[category] || '#6c5ce7';
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <BlogGrid>
      <PageHeading>Latest Saree Articles</PageHeading>
      <GridContainer>
        {blogs.map(blog => (
          <BlogCard key={blog._id}>
            <ImageContainer>
              <BlogImage
                src={blog.image}
                alt={blog.title}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Available'
                }}
              />
            </ImageContainer>
            <CardContent>
              <CategoryTag category={blog.category}>
                {blog.category.replace('-', ' ')}
              </CategoryTag>
              <BlogTitle>{blog.title}</BlogTitle>
              <BlogExcerpt>{blog.content.substring(0, 120)}...</BlogExcerpt>
              <ReadMoreButton to={`/blogs/${blog._id}`}>
                Continue Reading
                <FiArrowRight />
              </ReadMoreButton>
            </CardContent>
          </BlogCard>
        ))}
      </GridContainer>
    </BlogGrid>
  );
};

export default BlogList;