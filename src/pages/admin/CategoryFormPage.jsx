import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Image as ImageIcon, Tag, FileText, 
  Star, Eye, Search, Folder, X, Upload, Loader2
} from 'lucide-react';
import {
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetRootCategoriesQuery,
  useUploadCategoryImageMutation,
  useUploadCategoryIconMutation,
} from '../../features/CategoryManagement/categoryManagementApi';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function CategoryFormPage() {
  usePageTitle('Category Form');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id) && id !== 'create';

  // Fetch category if editing
  const { data: categoryData } = useGetCategoryByIdQuery(id, { skip: !isEditMode });
  const { data: rootCategoriesData } = useGetRootCategoriesQuery();

  // Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadCategoryImageMutation();
  const [uploadIcon, { isLoading: isUploadingIcon }] = useUploadCategoryIconMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    parent_id: '',
    sort_order: '',
    is_featured: false,
    is_active: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [errors, setErrors] = useState({});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [iconUploadError, setIconUploadError] = useState('');

  // Tree and Eco-themed icons
  const popularIcons = [
    'fa-tree', 'fa-seedling', 'fa-leaf', 'fa-spa', 'fa-pagelines',
    'fa-envira', 'fa-canadian-maple-leaf', 'fa-fan', 'fa-feather',
    'fa-sun', 'fa-cloud-sun', 'fa-water', 'fa-tint', 'fa-wind',
    'fa-mountain', 'fa-globe', 'fa-globe-americas', 'fa-globe-asia',
    'fa-recycle', 'fa-solar-panel', 'fa-charging-station', 'fa-lightbulb',
    'fa-apple-alt', 'fa-lemon', 'fa-carrot', 'fa-pepper-hot',
    'fa-flower', 'fa-flower-tulip', 'fa-clover', 'fa-mushroom',
    'fa-bug', 'fa-dove', 'fa-crow', 'fa-kiwi-bird', 'fa-fish',
    'fa-paw', 'fa-hippo', 'fa-frog', 'fa-otter', 'fa-dragon',
  ];

  // Load category data if editing
  useEffect(() => {
    if (isEditMode && categoryData?.data) {
      const cat = categoryData.data;
      setFormData({
        name: cat.name || '',
        description: cat.description || '',
        image: cat.image || '',
        icon: cat.icon || '',
        parent_id: cat.parent_id || '',
        sort_order: cat.sort_order || '',
        is_featured: cat.is_featured || false,
        is_active: cat.is_active !== undefined ? cat.is_active : true,
        meta_title: cat.meta_title || '',
        meta_description: cat.meta_description || '',
        meta_keywords: cat.meta_keywords || '',
      });
    }
  }, [isEditMode, categoryData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (formData.name.length > 100) {
      newErrors.name = 'Category name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const payload = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        sort_order: formData.sort_order ? parseInt(formData.sort_order) : null,
      };

      let categoryId;
      if (isEditMode && id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
          alert('Invalid category ID');
          return;
        }
        await updateCategory({ id: numericId, ...payload }).unwrap();
        categoryId = numericId;
      } else {
        const result = await createCategory(payload).unwrap();
        categoryId = result.data.id;
      }

      // Upload image if file selected
      if (selectedFile && categoryId) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        await uploadImage({ id: categoryId, formData }).unwrap();
      }

      // Upload icon if file selected
      if (selectedIconFile && categoryId) {
        const iconFormData = new FormData();
        iconFormData.append('icon', selectedIconFile);
        await uploadIcon({ id: categoryId, formData: iconFormData }).unwrap();
      }

      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to save category:', error);
      alert(error?.data?.message || 'Failed to save category');
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle icon file selection
  const handleIconFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        setIconUploadError('Please select a PNG file');
        return;
      }
      if (file.size > 1024 * 1024) {
        setIconUploadError('Icon size must be less than 1MB');
        return;
      }
      setSelectedIconFile(file);
      setIconUploadError('');
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, icon: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const rootCategories = rootCategoriesData?.data || [];
  const isLoading = isCreating || isUpdating || isUploading || isUploadingIcon;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/admin/categories" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Categories
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-[#1A1A1A] mb-2">
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </h1>
        <p className="text-[#666666]">
          {isEditMode ? 'Update category information' : 'Add a new product category'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Electronics, Fashion, Home & Garden"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-[#568F87] ${
                      errors.name ? 'border-[#EF4444]' : 'border-[#E5E5E5]'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[#EF4444] text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe this category..."
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Parent Category (Optional)
                  </label>
                  <select
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                  >
                    <option value="">None (Root Category)</option>
                    {rootCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[#666666] text-sm mt-1">
                    Select a parent category to make this a subcategory
                  </p>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Media & Icons</h2>
              
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Category Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#E5E5E5] rounded-lg hover:border-[#568F87] transition-colors">
                          <Upload size={20} className="text-[#666666]" />
                          <span className="text-[#666666]">
                            {selectedFile ? selectedFile.name : 'Choose image file'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {(selectedFile || formData.image) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setFormData(prev => ({ ...prev, image: '' }));
                            setUploadError('');
                          }}
                          className="px-3 py-3 bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {uploadError && (
                      <p className="text-[#EF4444] text-sm">{uploadError}</p>
                    )}
                    <p className="text-[#666666] text-sm">
                      Upload an image or enter URL below (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Or Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={selectedFile ? '' : formData.image}
                    onChange={handleChange}
                    disabled={!!selectedFile}
                    placeholder="https://example.com/category-image.jpg"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div>
                    <label className="block text-[#1A1A1A] mb-2">Preview</label>
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-full h-48 object-cover rounded-lg border border-[#E5E5E5]"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}

                {/* Icon */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Category Icon
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#E5E5E5] rounded-lg hover:border-[#568F87] transition-colors">
                          <Upload size={20} className="text-[#666666]" />
                          <span className="text-[#666666]">
                            {selectedIconFile ? selectedIconFile.name : 'Upload icon (100x100 PNG, max 1MB)'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/png"
                          onChange={handleIconFileChange}
                          className="hidden"
                        />
                      </label>
                      {(selectedIconFile || (formData.icon && formData.icon.startsWith('http'))) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIconFile(null);
                            setFormData(prev => ({ ...prev, icon: '' }));
                            setIconUploadError('');
                          }}
                          className="px-3 py-3 bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {iconUploadError && (
                      <p className="text-[#EF4444] text-sm">{iconUploadError}</p>
                    )}
                    {formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('data:')) && (
                      <div className="flex items-center gap-2">
                        <img src={formData.icon} alt="Icon preview" className="w-16 h-16 object-contain border border-[#E5E5E5] rounded-lg p-2 bg-white" />
                        <span className="text-[#666666] text-sm">Icon preview</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* FontAwesome Icon Picker */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">
                    Or Select FontAwesome Icon
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md text-left flex items-center justify-between hover:border-[#568F87]"
                    >
                      <span className="flex items-center gap-2">
                        {formData.icon ? (
                          <>
                            <i className={`${formData.icon} text-[#064232]`}></i>
                            <span className="text-[#1A1A1A]">{formData.icon}</span>
                          </>
                        ) : (
                          <span className="text-[#666666]">Select an icon...</span>
                        )}
                      </span>
                      <Search size={18} className="text-[#666666]" />
                    </button>

                    {showIconPicker && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-2">
                          {popularIcons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, icon }));
                                setShowIconPicker(false);
                              }}
                              className={`p-3 rounded-lg hover:bg-[#FFF5F2] transition-colors ${
                                formData.icon === icon ? 'bg-[#064232]/10 text-[#064232]' : 'text-[#666666]'
                              }`}
                              title={icon}
                            >
                              <i className={`${icon} text-xl`}></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[#666666] text-sm mt-1">
                    Used for navigation menus and mobile apps
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">SEO Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#1A1A1A] mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder="Category Name | Your Store"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] mb-2">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Description for search engines..."
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                  />
                  <p className="text-[#666666] text-sm mt-1">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleChange}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Status & Settings</h2>
              
              <div className="space-y-4">
                {/* Sort Order */}
                <div>
                  <label className="block text-[#1A1A1A] mb-2">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                  />
                  <p className="text-[#666666] text-sm mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                {/* Is Featured */}
                <div className="flex items-center justify-between p-3 bg-[#FFF5F2] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="text-[#F59E0B]" size={20} />
                    <label className="text-[#1A1A1A]">Featured Category</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#064232]"></div>
                  </label>
                </div>

                {/* Is Active */}
                <div className="flex items-center justify-between p-3 bg-[#FFF5F2] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="text-[#10B981]" size={20} />
                    <label className="text-[#1A1A1A]">Active Status</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                <h2 className="text-[#1A1A1A] mb-4">Preview</h2>
                <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-[#064232] to-[#568F87] flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                    ) : formData.icon ? (
                      <i className={`${formData.icon} text-white text-4xl`}></i>
                    ) : (
                      <Tag className="text-white" size={48} />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#1A1A1A] font-semibold mb-1">{formData.name}</h3>
                    <p className="text-[#666666] text-sm line-clamp-2">
                      {formData.description || 'No description'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Save size={18} />
                  {isLoading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                </Button>
                <Link to="/admin/categories" className="block">
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}