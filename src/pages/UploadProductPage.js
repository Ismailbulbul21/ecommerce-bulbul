import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addProduct } from '../services/api';
import Input from '../components/common/Input';
import { PRODUCT_CATEGORIES } from '../utils/constants';

function UploadProductPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sellerInfo: {
      name: '',
      email: user?.email || '',
      phone: '',
      location: ''
    }
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const maxImages = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('seller.')) {
      const sellerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        sellerInfo: {
          ...prev.sellerInfo,
          [sellerField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Each image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        return;
      }
    }

    if (files.length + images.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Process images
    try {
      const processedFiles = files.map(file => {
        // Create a smaller version of the image
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              // Max dimensions
              const MAX_SIZE = 800;
              if (width > height) {
                if (width > MAX_SIZE) {
                  height *= MAX_SIZE / width;
                  width = MAX_SIZE;
                }
              } else {
                if (height > MAX_SIZE) {
                  width *= MAX_SIZE / height;
                  height = MAX_SIZE;
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
              }, 'image/jpeg', 0.7);
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
      });

      const optimizedFiles = await Promise.all(processedFiles);
      setImages(prev => [...prev, ...optimizedFiles]);

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Error processing images. Please try again.');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return setError('Please select at least one image');
    }

    const phoneRegex = /^\+?[0-9]{10,}$/;
    if (!phoneRegex.test(formData.sellerInfo.phone)) {
      return setError('Please enter a valid phone number');
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting upload...');
      await addProduct({
        ...formData,
        userId: user.uid,
        userEmail: user.email
      }, images);
      
      console.log('Upload successful');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/products');
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform transition-all duration-500 ease-in-out animate-bounce max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Si Fiican Ayaa Loo Diray!</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Alaabadaada waxaa dib u eegis ku sameyn doona maamulka</p>
                <div className="flex items-center justify-center space-x-2 text-yellow-600">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-medium">Waxaa dib u eegis ku sameynaya maamulka</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Iib Alaabadaada</h1>
          <p className="text-gray-300">Buuxi macluumaadka hoose si aad u iibiso alaabadaada</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Product Information */}
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-6">Macluumaadka Alaabta</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Magaca Alaabta
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Gali magaca alaabta"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Faahfaahin</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows="4"
                      placeholder="Sharax alaabta..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Qiimaha ($)</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Gali qiimaha"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Nooca</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Dooro nooca</option>
                        {PRODUCT_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-6">Sawirrada Alaabta</h2>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Riix si aad u soo geliso</span> ama soo jiid sawirka
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG ilaa 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={images.length >= maxImages}
                    />
                  </label>
                </div>

                {/* Image Previews */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Seller Information */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-700 h-fit">
              <h2 className="text-2xl font-semibold text-white mb-6">Macluumaadka Iibiyaha</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Magaca Oo Buuxa</label>
                  <input
                    name="seller.name"
                    value={formData.sellerInfo.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Gali magacaaga oo buuxa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Emailka</label>
                  <input
                    name="seller.email"
                    type="email"
                    value={formData.sellerInfo.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Gali emailkaaga"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Telefoonka</label>
                  <input
                    name="seller.phone"
                    type="tel"
                    value={formData.sellerInfo.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+252 617211084"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Goobta</label>
                  <input
                    name="seller.location"
                    value={formData.sellerInfo.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Magaalada, Degmada, Xaafada"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-primary-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Waa la dirayaa...
              </div>
            ) : (
              'Dir Alaabta'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadProductPage; 