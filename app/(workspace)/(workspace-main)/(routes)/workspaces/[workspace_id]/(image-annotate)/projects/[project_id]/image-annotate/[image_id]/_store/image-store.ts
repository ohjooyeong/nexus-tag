/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { imageDataFromUrl } from '../_helpers/image-view/image-view.helpers';
import {
  getMaskOptimisationMultiplier,
  getScaledImageData,
} from '../_utils/store-utils';

interface State {
  imageData: (ImageData | null)[];
  objectStorage: (any | null)[];
  currentImageObjectId: number | null;
}

interface Actions {
  getImageData: (index?: number) => ImageData | null;
  getObject: (id: number) => any | null;
  saveImageData: (data: ImageData, index?: number) => void;
  storeObject: (obj: any) => number;
  clearStorage: () => void;
  releaseObject: (id: number) => void;
  processAndStoreImage: (imageUrl: string) => Promise<number>;
}

type ImageStore = State & Actions;

export const useImageStore = create<ImageStore>((set, get) => ({
  imageData: [null, null],
  objectStorage: [null],
  currentImageObjectId: null,

  getImageData: (index = 0) => {
    return get().imageData[index] || null;
  },

  getObject: (id: number) => {
    return get().objectStorage[id];
  },

  processAndStoreImage: async (imageUrl: string) => {
    const { imageData, imageObject } = await imageDataFromUrl(imageUrl);
    if (!imageData) throw new Error('Failed to convert image to ImageData');

    const newObjectId = get().storeObject(imageObject);
    get().saveImageData(imageData);

    const currentId = get().currentImageObjectId;
    if (currentId !== null && currentId !== newObjectId) {
      get().releaseObject(currentId);
    }

    const maskOptimizationMultiplier = getMaskOptimisationMultiplier([
      imageObject.width,
      imageObject.height,
    ]);

    const scaledImageData = await getScaledImageData(
      imageData,
      maskOptimizationMultiplier,
    );
    get().saveImageData(scaledImageData, 1);

    return newObjectId;
  },

  saveImageData: (data: ImageData, index = 0) => {
    set((state) => ({
      imageData: state.imageData.map((item, i) => (i === index ? data : item)),
    }));
  },

  storeObject: (obj: any) => {
    const newObjectId = get().objectStorage.length;
    set((state) => ({
      objectStorage: [...state.objectStorage, obj],
    }));
    return newObjectId;
  },

  clearStorage: () => {
    set({
      imageData: [null, null],
      objectStorage: [null],
    });
  },

  releaseObject: (id) => {
    const currentStorage = [...get().objectStorage];
    currentStorage[id] = null;
    set({ objectStorage: currentStorage });
  },
}));
