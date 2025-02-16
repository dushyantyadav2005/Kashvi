import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const PageContainer = styled.div`
  padding: 5rem 2rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  min-height: 100vh;
  position: relative;

  @media (min-width: 768px) {
    padding: 6rem 4rem 3rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  position: absolute;
  top: 2rem;
  left: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    background: #5b4bc4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  @media (min-width: 768px) {
    left: 4rem;
    top: 3rem;
  }
`;

const HeroImage = styled.div`
  width: 100%;
  height: 50vh;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  margin: 2rem 0;
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  animation: ${float} 6s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%);
  }

  @media (min-width: 768px) {
    height: 60vh;
    margin: 3rem 0;
  }
`;

const Title = styled.h1`
  font-family: Georgia, serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3436;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.3;
  position: relative;

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

  @media (min-width: 768px) {
    font-size: 2.8rem;
    margin-bottom: 3rem;
  }
`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  animation: ${fadeIn} 0.8s ease-out;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 3rem;
    border-radius: 20px;
  }
`;

const MetaData = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: #636e72;
  font-size: 0.9rem;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (min-width: 768px) {
    gap: 2rem;
    margin-bottom: 2rem;
  }
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: #2d3436;
  margin-bottom: 2rem;

  p {
    margin-bottom: 1.2rem;
  }

  @media (min-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.8;
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
    border: 5px solid #f3f3f3;
    border-top: 5px solid #6c5ce7;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!blog) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Blog post not found</h2>
      <p>The requested blog post could not be loaded.</p>
    </div>
  );

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft style={{ fontSize: '1.2rem' }} /> 
        <span>Back</span>
      </BackButton>

      <HeroImage>
        <img 
          src={blog.image} 
          alt={blog.title}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Available'
          }}
        />
      </HeroImage>

      <Title>{blog.title}</Title>

      <ContentWrapper>
        <MetaData>
          <div><FiUser /> By Admin</div>
          <div><FiClock /> {Math.ceil(blog.content.length / 1000)} min read</div>
          <div>• {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
        </MetaData>

        <Content dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
      </ContentWrapper>
    </PageContainer>
  );
};

export default BlogDetail;