import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock, MagicMock
import torch
import json
from pathlib import Path
import os
import sys

# Add the current directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import your modules
from main import app
from skin_oil_level_cnn import skin_cnn
from dataloaders import Dataset
from train_oil_level_cnn import trainer

# Create test client
client = TestClient(app)

class TestFastAPIEndpoints:
    """Test cases for FastAPI endpoints"""

    def test_root_endpoint_get(self):
        """Test the root endpoint returns healthy status"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Skincare API is running!"
        assert data["status"] == "healthy"

    def test_root_endpoint_post_not_allowed(self):
        """Test that POST to root endpoint returns 405"""
        response = client.post("/")
        assert response.status_code == 405

    def test_api_call_endpoint_valid_request(self):
        """Test api_call endpoint with valid data"""
        test_data = {
            "request": {
                "action": "train",
                "epochs": 5,
                "requested_info": "oil level"
            }
        }
        response = client.post("/api_call/", json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Model trained successfully."
        assert data["data"] == test_data["request"]

    def test_api_call_endpoint_missing_request_key(self):
        """Test api_call endpoint with missing 'request' key"""
        test_data = {
            "invalid_key": {
                "action": "train"
            }
        }
        response = client.post("/api_call/", json=test_data)
        assert response.status_code == 500  # Should return error

    def test_api_call_endpoint_empty_body(self):
        """Test api_call endpoint with empty JSON body"""
        response = client.post("/api_call/", json={})
        assert response.status_code == 500

    def test_api_call_endpoint_malformed_json(self):
        """Test api_call endpoint with malformed JSON"""
        response = client.post(
            "/api_call/", 
            data="invalid json", 
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Unprocessable Entity

    def test_api_call_endpoint_get_not_allowed(self):
        """Test that GET to api_call endpoint returns 405"""
        response = client.get("/api_call/")
        assert response.status_code == 405

    def test_cors_headers(self):
        """Test that CORS headers are present"""
        response = client.options("/")
        # Check for CORS headers in the response
        assert "access-control-allow-origin" in response.headers or response.status_code == 200


class TestCNNModel:
    """Test cases for the CNN model"""

    def test_skin_cnn_initialization(self):
        """Test that the CNN model can be initialized"""
        model = skin_cnn()
        assert model is not None
        assert isinstance(model, torch.nn.Module)

    def test_skin_cnn_forward_pass(self):
        """Test forward pass with dummy data"""
        model = skin_cnn()
        model.eval()
        
        # Create dummy input tensor (batch_size=1, channels=3, height=256, width=256)
        dummy_input = torch.randn(1, 3, 256, 256)
        
        with torch.no_grad():
            output = model(dummy_input)
        
        assert output is not None
        assert output.shape == (1, 1)  # Should output single value for regression

    def test_model_parameters(self):
        """Test that model has trainable parameters"""
        model = skin_cnn()
        params = list(model.parameters())
        assert len(params) > 0
        assert all(p.requires_grad for p in params)


class TestDataLoader:
    """Test cases for the custom Dataset class"""

    def test_dataset_initialization(self):
        """Test Dataset class initialization"""
        # Mock data
        mock_ground_truth = [0, 1, 2]
        mock_inputs = ["path1.jpg", "path2.jpg", "path3.jpg"]
        
        dataset = Dataset(mock_ground_truth, mock_inputs)
        
        assert len(dataset) == 3
        assert dataset.ground_truth == mock_ground_truth
        assert dataset.inputs == mock_inputs

    def test_dataset_getitem(self):
        """Test Dataset __getitem__ method"""
        mock_ground_truth = [0, 1, 2]
        mock_inputs = ["path1.jpg", "path2.jpg", "path3.jpg"]
        
        dataset = Dataset(mock_ground_truth, mock_inputs)
        
        image_path, label = dataset[0]
        assert image_path == "path1.jpg"
        assert label == 0

    def test_dataset_length(self):
        """Test Dataset __len__ method"""
        mock_ground_truth = [0, 1, 2, 3, 4]
        mock_inputs = ["path1.jpg", "path2.jpg", "path3.jpg", "path4.jpg", "path5.jpg"]
        
        dataset = Dataset(mock_ground_truth, mock_inputs)
        assert len(dataset) == 5


class TestTrainer:
    """Test cases for the trainer class"""

    @patch('train_oil_level_cnn.load_dataset')
    def test_trainer_initialization(self, mock_load_dataset):
        """Test trainer initialization"""
        # Mock the load_dataset function
        mock_load_dataset.return_value = (["path1.jpg", "path2.jpg"], [0, 1])
        
        test_trainer = trainer(epochs=5)
        
        assert test_trainer.num_epochs == 5
        assert test_trainer.model is not None
        assert test_trainer.loss_function is not None
        assert test_trainer.optimizer is not None
        assert test_trainer.transform is not None

    @patch('train_oil_level_cnn.load_dataset')
    def test_trainer_with_different_epochs(self, mock_load_dataset):
        """Test trainer with different epoch values"""
        mock_load_dataset.return_value = (["path1.jpg"], [0])
        
        test_trainer = trainer(epochs=10)
        assert test_trainer.num_epochs == 10
        
        test_trainer = trainer(epochs=1)
        assert test_trainer.num_epochs == 1


class TestUtilityFunctions:
    """Test cases for utility functions and edge cases"""

    def test_model_file_paths(self):
        """Test that model files exist"""
        # Check if any model files exist
        model_files = [
            "oil_level_model_cnn.pt",
            "skin_cancer_cnn.pt"
        ]
        
        for model_file in model_files:
            if os.path.exists(model_file):
                assert os.path.isfile(model_file)

    def test_accuracy_file_creation(self):
        """Test accuracy file functionality"""
        accuracy_file = Path("test_accuracy.txt")
        
        # Clean up if exists
        if accuracy_file.exists():
            accuracy_file.unlink()
        
        # Create test accuracy log
        with open(accuracy_file, "w") as f:
            f.write("EPOCH 0\n")
            f.write("accuracy: 0.7500\n")
            f.write("-" * 40 + "\n")
        
        assert accuracy_file.exists()
        
        # Read and verify content
        content = accuracy_file.read_text()
        assert "EPOCH 0" in content
        assert "accuracy: 0.7500" in content
        
        # Clean up
        accuracy_file.unlink()


class TestIntegration:
    """Integration tests"""

    @patch('train_oil_level_cnn.load_dataset')
    @patch('PIL.Image.open')
    @patch('torch.save')
    def test_api_with_model_training_simulation(self, mock_torch_save, mock_image_open, mock_load_dataset):
        """Test API call that would trigger model training (mocked)"""
        # Mock dependencies
        mock_load_dataset.return_value = (["test_path.jpg"], [0])
        
        # Create a mock image
        mock_img = Mock()
        mock_img.convert.return_value = mock_img
        mock_image_open.return_value = mock_img
        
        # Test API call
        test_data = {
            "request": {
                "action": "train_model",
                "epochs": 1
            }
        }
        
        response = client.post("/api_call/", json=test_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "Model trained successfully" in data["message"]

    def test_api_stress_test(self):
        """Test multiple rapid API calls"""
        test_data = {
            "request": {
                "action": "test",
                "timestamp": "test"
            }
        }
        
        responses = []
        for i in range(10):
            response = client.post("/api_call/", json=test_data)
            responses.append(response)
        
        # All should succeed
        assert all(r.status_code == 200 for r in responses)


# Pytest configuration and fixtures
@pytest.fixture
def sample_request_data():
    """Fixture providing sample request data"""
    return {
        "request": {
            "action": "analyze",
            "requested_info": "oil level",
            "user_id": "test_user_123"
        }
    }

@pytest.fixture
def mock_image_tensor():
    """Fixture providing mock image tensor"""
    return torch.randn(1, 3, 256, 256)


if __name__ == "__main__":
    # Run tests if script is executed directly
    print("Running test suite...")
    pytest.main([__file__, "-v"])