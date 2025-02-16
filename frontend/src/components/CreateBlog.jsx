import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { FiArrowLeft, FiImage, FiEdit, FiTag } from "react-icons/fi";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const CreateContainer = styled(Container)`
  padding: 4rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #f1f3f5, #e9ecef);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  position: relative;
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #6c5ce7;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background: #5b4bc4;
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
`;

const FormTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #2d3436;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #6c5ce7;
  }
`;

const StyledForm = styled(Form)`
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  backdrop-filter: blur(8px);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(108,92,231,0.1), transparent);
    animation: ${float} 6s linear infinite;
  }
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 2rem;
  position: relative;
`;

const FormLabel = styled(Form.Label)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const FormIcon = styled.span`
  color: #6c5ce7;
  font-size: 1.2rem;
`;

const FormControl = styled(Form.Control)`
  border-radius: 10px;
  padding: 1rem 1.2rem;
  border: 2px solid #e8eef4;
  transition: all 0.3s ease;
  font-size: 1rem;
  box-shadow: none !important;

  &:focus {
    border-color: #6c5ce7;
    background: rgba(108,92,231,0.03);
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: ${props => props.image ? `url(${props.image})` : '#f8f9fa'};
  background-size: cover;
  background-position: center;
  margin-top: 1rem;
  border: 2px dashed ${props => props.image ? '#6c5ce7' : '#e8eef4'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: ${props => !props.image && "'Upload or paste image URL'"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #adb5bd;
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: 1.2rem;
  font-weight: 600;
  background: linear-gradient(45deg, #6c5ce7, #8e7cf3);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108,92,231,0.3);
  }

  &:disabled {
    background: #a8a4d6;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: ${float} 3s linear infinite;
  }
`;

const CharacterCounter = styled.span`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #adb5bd;
`;

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !content || !category || !image) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/blogs", {
        title,
        content,
        category,
        image,
      });
      
      setSuccess("Blog created successfully!");
      setLoading(false);
      
      setTimeout(() => {
        navigate("/blogs");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create blog");
      setLoading(false);
    }
  };

  return (
    <CreateContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Blogs
      </BackButton>

      <HeroSection>
        <FormTitle>
          <FiEdit /> Create New Masterpiece
        </FormTitle>
        <p className="text-muted">Share your saree expertise with the world</p>
      </HeroSection>

      <StyledForm onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <FormGroup>
          <FormLabel>
            <FormIcon><FiEdit /></FormIcon>
            Blog Title
          </FormLabel>
          <FormControl
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Craft an engaging title..."
            maxLength={120}
          />
          <CharacterCounter>{title.length}/120</CharacterCounter>
        </FormGroup>

        <FormGroup>
          <FormLabel>
            <FormIcon><FiEdit /></FormIcon>
            Content
          </FormLabel>
          <FormControl
            as="textarea"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your knowledge..."
            maxLength={2000}
          />
          <CharacterCounter>{content.length}/2000</CharacterCounter>
        </FormGroup>

        <FormGroup>
          <FormLabel>
            <FormIcon><FiTag /></FormIcon>
            Category
          </FormLabel>
          <FormControl
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="styling">Saree Styling</option>
            <option value="fabric-care">Fabric Care</option>
            <option value="fashion-trends">Fashion Trends</option>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormLabel>
            <FormIcon><FiImage /></FormIcon>
            Featured Image
          </FormLabel>
          <FormControl
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste image URL or upload..."
          />
          <ImagePreview image={image} />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Weaving Magic...</span>
            </>
          ) : (
            "Publish Article ✨"
          )}
        </SubmitButton>
      </StyledForm>
    </CreateContainer>
  );
};

export default CreateBlog;