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

// Function to upload image to ImgBB
const uploadImageToImgBB = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
    
    return data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
};

// Optimized product upload function with better error handling
export const addProduct = async (productData, imageFiles) => {
  try {
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('No images provided');
    }

    console.log('Starting image upload...');
    const imageUrls = [];
    
    // Upload images sequentially to avoid rate limiting
    for (const file of imageFiles) {
      try {
        const url = await uploadImageToImgBB(file);
        imageUrls.push(url);
        console.log('Image uploaded successfully:', url);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('No images were uploaded successfully');
    }

    console.log('All images uploaded, adding product to Firestore...');

    // Add product with image URLs to Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      imageUrl: imageUrls[0], // First image as main image
      imageUrls: imageUrls, // All image URLs
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    console.log('Product added successfully:', docRef.id);
    return docRef.id;

  } catch (error) {
    console.error('Error in addProduct:', error);
    throw new Error(error.message || 'Failed to upload product');
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