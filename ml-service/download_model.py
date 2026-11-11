"""
Optional local trainer if you want your own .h5 weights.

Default production path does NOT need this. The Flask service auto-downloads
a pretrained 38-class PlantVillage MobileNetV2 from Hugging Face.

To train your own Keras model instead:
  1. Download https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
  2. Extract color images so class folders sit directly under ./data/plantvillage
  3. pip install tensorflow
  4. python download_model.py train ./data/plantvillage
"""

import os
import sys

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10
NUM_CLASSES = 38


def build_model():
    import tensorflow as tf
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
    from tensorflow.keras.models import Model

    base = MobileNetV2(weights="imagenet", include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    for layer in base.layers[:-20]:
        layer.trainable = False
    x = GlobalAveragePooling2D()(base.output)
    x = Dense(512, activation="relu")(x)
    x = Dropout(0.3)(x)
    output = Dense(NUM_CLASSES, activation="softmax")(x)
    model = Model(inputs=base.input, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def train_model(data_dir):
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
    )
    train_gen = datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
    )
    val_gen = datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
    )
    if train_gen.num_classes != NUM_CLASSES:
        raise SystemExit(
            f"Expected {NUM_CLASSES} class folders, found {train_gen.num_classes} in {data_dir}"
        )
    model = build_model()
    print(f"Training on {train_gen.samples} samples...")
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=2),
        tf.keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_DIR, "plant_disease_model.h5"),
            save_best_only=True,
            monitor="val_accuracy",
        ),
    ]
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS, callbacks=callbacks)
    print(f"Model saved to {MODEL_DIR}/plant_disease_model.h5")
    return model


if __name__ == "__main__":
    print("FarmScan uses a pretrained Hugging Face model by default.")
    print("Start the API with: python app.py")
    print("Optional Keras training: python download_model.py train ./data/plantvillage")
    if len(sys.argv) == 3 and sys.argv[1] == "train":
        data_dir = sys.argv[2]
        if os.path.exists(data_dir):
            train_model(data_dir)
        else:
            print(f"Data directory not found: {data_dir}")
