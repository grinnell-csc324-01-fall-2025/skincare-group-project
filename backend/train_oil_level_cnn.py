from pathlib import Path
import torch.nn as nn
import os
from torch import Tensor
import torch.nn.functional as F
import torchvision.transforms as TF
from PIL import Image
import torch.nn as nn
import torchvision
from torchvision import transforms
from skin_oil_level_cnn import skin_cnn
from load_data import load_dataset
from torch.optim import Adam
import torch
from dataloaders import Dataset


class trainer():

    # constructor for hyperparameter containment
    def __init__(self, epochs):
        self.num_epochs = epochs
        self.input_filepaths, self.ground_truth = load_dataset()
        self.model = skin_cnn()
        self.loss_function = nn.BCEWithLogitsLoss()
        self.optimizer = Adam(self.model.parameters(), lr=0.000167)
        self.transform = TF.Compose([TF.Resize((256, 256)), TF.ToTensor()])


    # training function, for forward/back prop loop
    def train(self):


        # training loop
        for epoch in range(0, self.num_epochs):

            # get and shuffle the dataset via the dataLoader class
            dataset = Dataset(self.input_filepaths, self.ground_truth)
            trainset = torch.utils.data.DataLoader(dataset=dataset, batch_size=1, shuffle=True)
            correct = 0
            
            
            # enumerate over the input path and label values
            for i, skin_observation in enumerate(trainset):

                # establish the inputs as tensors
                label = skin_observation[0].float().unsqueeze(0)
                input_path = skin_observation[1][0]
                image_file = Image.open(input_path)
                input_tensor = self.transform(image_file)
                input_tensor = input_tensor.unsqueeze(0)
                losses = 0.0

                # obtain the inference
                prediction = self.model(input_tensor)
                

                # zero out the gradients
                self.optimizer.zero_grad()

                # calculate the loss
                loss = self.loss_function(prediction, label)
                losses += loss.item()

                # print the progress, correctess and
                pred = prediction[0][0].item() 
                ground_truth = label[0][0].item()
                diff_oil = abs(pred - 0)
                diff_dry = abs(pred - 1)
                diff_normal = abs(pred - 2)
                print("prediction (oil, dry, normal): " + str([diff_oil, diff_dry, diff_normal]) + " with ground truth: " + str(ground_truth))
                predicted_class = min(diff_oil, diff_dry, diff_normal)
                if predicted_class == diff_oil and ground_truth == 0:
                    correct += 1
                    print("\nthe model prediced oil, " + str(pred)+ " and the ground truth is " + str(ground_truth) + " so it is correct\n")
                elif predicted_class == diff_dry and ground_truth == 1:
                    correct += 1
                    print("\nthe model prediced dry, " + str(pred)+ " and the ground truth is " + str(ground_truth) + " so it is correct\n")
                elif predicted_class == diff_normal and ground_truth == 2:
                    correct += 1
                    print("\nthe model prediced normal, " + str(pred)+ " and the ground truth is " + str(ground_truth) + " so it is correct\n")
                else:
                    print("\nthe model prediced " + str(pred)+ " and the ground truth is " + str(ground_truth) + " so it is incorrect\n")



                # calculate the derivatives
                loss.backward()

                # apply the calculations
                self.optimizer.step()


            # save the model's accuracy data as a text file
            log_path = Path("accuracy.txt")
            with open(log_path, "a") as f:
                f.write(f"EPOCH {epoch}\n")
                f.write(f"accuracy: {(correct / len(trainset)):.4f}\n")
                f.write("-" * 40 + "\n")


            # save the model state
            torch.save(self.model.state_dict(), f"/Users/johnmiller/Desktop/skinsense_backend/saved_skinsense_models/epoch_{epoch}_model.pt")