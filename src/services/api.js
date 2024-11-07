import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { db } from './firebase';

const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY; // Replace with your ImgBB API key

// Function to compress image before uploading
const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        }, 'image/jpeg', 0.7); // Compress with 70% quality
      };
    };
  });
};

// Optimized image upload function
const uploadImageToImgBB = async (imageFile) => {
  try {
    // Compress image before upload
    const compressedFile = await compressImage(imageFile);
    
    const formData = new FormData();
    formData.append('image', compressedFile);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw error;
  }
};

// Products
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Optimized product upload function
export const addProduct = async (productData, imageFiles) => {
  try {
    // Upload images in parallel with Promise.all
    const uploadPromises = imageFiles.map(file => uploadImageToImgBB(file));
    const imageUrls = await Promise.all(uploadPromises);

    // Add product with image URLs to Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      imageUrl: imageUrls[0], // First image as main image
      imageUrls: imageUrls, // All image URLs
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    // Verify the update
    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists() || updatedDoc.data().status !== productData.status) {
      throw new Error('Failed to update product status');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Contact Form
export const submitContactForm = async (formData) => {
  try {
    await addDoc(collection(db, 'contacts'), {
      ...formData,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Update the checkAdminStatus function to check for role and boolean value
export const checkAdminStatus = async (uid) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    return adminDoc.exists() && adminDoc.data().role === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};