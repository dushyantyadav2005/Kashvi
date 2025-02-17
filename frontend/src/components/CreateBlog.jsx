import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container, Form } from "react-bootstrap";
import { FiArrowLeft, FiImage, FiEdit, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import ProperButtonBlack from "../components/ProperButtonBlack";

const CreateContainer = styled(Container)`
  padding: 4rem 0;
  min-height: 100vh;
  background: #fff;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #480815;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    background: #2d030d;
    transform: translateY(-2px);
  }
`;

const StyledForm = styled(Form)`
  background: white;
  padding: 2.5rem;
  border-radius: 0.5rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 2rem;
`;

const FormLabel = styled(Form.Label)`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #480815;
  font-size: 0.9rem;
`;

const FormControl = styled(Form.Control)`
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid #480815;
  background: #c3183a16;
  color: #333;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #D4AF37;
    border-color: #480815;
    background: #fff;
  }
`;

const ImageUploadLabel = styled.label`
  display: block;
  width: 100%;
  padding: 1.5rem;
  border: 2px dashed #480815;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  color: #480815;
  transition: all 0.3s ease;
  background: #c3183a16;

  &:hover {
    border-color: #D4AF37;
    background: #f8f0e6;
  }

  input {
    display: none;
  }
`;

const CreateBlog = () => {
  // ... keep all the existing state and logic ...

  return (
    <CreateContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Blogs
      </BackButton>

      <StyledForm onSubmit={handleSubmit}>
        <h2 className="h4 text-center font-playfair m-10 mb-0 mt-0 text-4xl uppercase">NEW BLOG POST</h2>
        <h2 className="h4 text-center font-montserrat m-10 mt-0 mb-3 text-lg uppercase">creation form</h2>

        <div className="flex flex-wrap gap-4">
          <FormGroup className="flex-1">
            <FormLabel>
              <FiEdit className="inline mr-2" />
              Blog Title
            </FormLabel>
            <FormControl
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Craft an engaging title..."
              maxLength={120}
            />
            <div className="text-gray-500 text-sm mt-1">
              {title.length}/120
            </div>
          </FormGroup>

          <FormGroup className="flex-1">
            <FormLabel>
              <FiTag className="inline mr-2" />
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
        </div>

        <FormGroup>
          <FormLabel>
            <FiEdit className="inline mr-2" />
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
          <div className="text-gray-500 text-sm mt-1">
            {content.length}/2000
          </div>
        </FormGroup>

        <FormGroup>
          <FormLabel>
            <FiImage className="inline mr-2" />
            Featured Image
          </FormLabel>
          {image && (
            <div className="mb-3 text-center">
              <img
                src={image}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg"
              />
            </div>
          )}
          <ImageUploadLabel>
            {imageName || "Click to upload image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </ImageUploadLabel>
        </FormGroup>

        <div className="mt-8">
          <ProperButtonBlack type="submit" text="Publish Article" />
        </div>
      </StyledForm>
    </CreateContainer>
  );
};

export default CreateBlog;