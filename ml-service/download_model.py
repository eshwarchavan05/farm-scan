"""
Run this script to download and prepare the PlantVillage model.
This trains a MobileNetV2 model on the PlantVillage dataset.

Steps:
1. pip install -r requirements.txt
2. python download_model.py
   (This will download PlantVillage dataset and train the model)
3. Model will be saved to model/plant_disease_model.h5
"""

import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import zipfile
import urllib.request

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10
NUM_CLASSES = 38

def build_model():
    base = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    # Freeze base layers
    for layer in base.layers[:-20]:
        layer.trainable = False
    x = base.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    output = Dense(NUM_CLASSES, activation='softmax')(x)
    model = Model(inputs=base.input, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_model(data_dir):
    datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2
    )
    train_gen = datagen.flow_from_directory(
        data_dir, target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE, class_mode='categorical', subset='training'
    )
    val_gen = datagen.flow_from_directory(
        data_dir, target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE, class_mode='categorical', subset='validation'
    )
    model = build_model()
    print(f'Training on {train_gen.samples} samples...')
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=2),
        tf.keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_DIR, 'plant_disease_model.h5'),
            save_best_only=True, monitor='val_accuracy'
        )
    ]
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS, callbacks=callbacks)
    print(f'✅ Model saved to {MODEL_DIR}/plant_disease_model.h5')
    return model

if __name__ == '__main__':
    print('=== FarmScan ML Model Trainer ===')
    print('\nOption 1: Use Kaggle PlantVillage dataset')
    print('  - Download from: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset')
    print('  - Extract to: ml-service/data/plantvillage/')
    print('  - Run: python download_model.py train ./data/plantvillage')
    print('\nOption 2: Use pre-trained model (recommended for quick setup)')
    print('  - Download from Hugging Face or Kaggle pre-trained models')
    print('  - Place .h5 file in: ml-service/model/plant_disease_model.h5')
    print('\nThe Flask app will work in demo mode until a model is loaded.')

    import sys
    if len(sys.argv) == 3 and sys.argv[1] == 'train':
        data_dir = sys.argv[2]
        if os.path.exists(data_dir):
            train_model(data_dir)
        else:
            print(f'❌ Data directory not found: {data_dir}')
