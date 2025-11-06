import random
from PIL import Image
import os
import numpy
from torch.utils.data import dataloader



def load_dataset():
    flip = random.random()
    oily_filenames = os.listdir("/Users/johnmiller/Desktop/oil-data/train/oily")
    dry_filenames = os.listdir("/Users/johnmiller/Desktop/oil-data/train/dry")
    normal_filenames = os.listdir("/Users/johnmiller/Desktop/oil-data/train/normal")

    # load in filenames into the data/ground truth array
    oPath = "/Users/johnmiller/Desktop/oil-data/train/oily/"
    dPath = "/Users/johnmiller/Desktop/oil-data/train/dry/"
    nPath = "/Users/johnmiller/Desktop/oil-data/train/normal/"
    oInd = 0
    dInd = 0
    nInd = 0
    data = []
    ground_truth = []


    # loop over the lists of filenames to make a dataset
    while oInd < len(oily_filenames) and dInd < len(dry_filenames) and nInd < len(normal_filenames):
        rand = random.random()
        if rand < 0.33:
            data.append(oPath + oily_filenames[oInd])
            ground_truth.append(0)
            oInd += 1
        elif rand < 0.66:
            data.append(dPath + dry_filenames[dInd])
            ground_truth.append(1)
            dInd += 1
        else:
            data.append(nPath + normal_filenames[nInd])
            ground_truth.append(2)
            nInd += 1


    while dInd < len(dry_filenames) :
        data.append(dPath + dry_filenames[dInd])
        ground_truth.append(1)
        dInd += 1
    while nInd < len(normal_filenames) :
        data.append(nPath + normal_filenames[nInd])
        ground_truth.append(2)
        nInd += 1
    while oInd < len(oily_filenames) :
        data.append(oPath + oily_filenames[oInd])
        ground_truth.append(0)
        oInd += 1

    
    return [data, ground_truth]



def load_testset():
    benign_filenames = os.listdir("/Users/johnmiller/Desktop/skin_dataset_resized/test_set/benign")
    malignant_filenames = os.listdir("/Users/johnmiller/Desktop/skin_dataset_resized/test_set/malignant")
    

    # load in filenames into the data/ground truth array
    bPath = "/Users/johnmiller/Desktop/skin_dataset_resized/test_set/benign/"
    mPath = "/Users/johnmiller/Desktop/skin_dataset_resized/test_set/malignant/"
    bInd = 0
    mInd = 0
    data = []
    ground_truth = []


    # loop over the lists of filenames to make a dataset
    while bInd < len(benign_filenames) and mInd < len(malignant_filenames):
        rand = random.random()
        if rand < 0.56:
            data.append(bPath + benign_filenames[bInd])
            ground_truth.append(0)
            bInd += 1
        else:
            data.append(mPath + malignant_filenames[mInd])
            ground_truth.append(1)
            mInd += 1
    
    return [data, ground_truth]


def load_valset():
    benign_filenames = os.listdir("/Users/johnmiller/Desktop/skin_dataset_resized/val_set/benign")
    malignant_filenames = os.listdir("/Users/johnmiller/Desktop/skin_dataset_resized/val_set/malignant")
    

    # load in filenames into the data/ground truth array
    bPath = "/Users/johnmiller/Desktop/skin_dataset_resized/val_set/benign/"
    mPath = "/Users/johnmiller/Desktop/skin_dataset_resized/val_set/malignant/"
    bInd = 0
    mInd = 0
    data = []
    ground_truth = []

    # loop over the lists of filenames to make a dataset
    while bInd < len(benign_filenames) and mInd < len(malignant_filenames):
        rand = random.random()
        if rand < 0.56:
            data.append(bPath + benign_filenames[bInd])
            ground_truth.append(0)
            bInd += 1
        else:
            data.append(mPath + malignant_filenames[mInd])
            ground_truth.append(1)
            mInd += 1
    
    return [data, ground_truth]