import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, X, Image, MapPin, DollarSign, Building, FileText, Receipt, Home, File } from 'lucide-react';
import useIPFSUpload, { AssetsCreationMetadata } from "../hooks/useIPFSUpload";


// Mock property type for the interface
interface MyProperty {
  id?: string;
  name: string;
  location: string;
  propertyType: string;
  status: string;
  value: string;
  tokens: string;
  invested: string;
  image: string;
  description: string;
  listingFee: number;
  areaSqft: string;
  document: string; // New field for PDF document
}

const propertyTypes = ['Residential', 'Land', 'Commercial', 'Industrial'];
const statusOptions = ['Active', 'Inactive', 'Under Review', 'Sold'];
const FIXED_LISTING_FEE = 500; // Fixed listing fee amount

const AddProperty: React.FC = () => {
  const [form, setForm] = useState<Omit<MyProperty, 'id'>>({
    name: '',
    location: '',
    propertyType: 'Residential',
    status: 'Active',
    value: '',
    tokens: '',
    invested: '',
    image: '',
    description: '',
    listingFee: FIXED_LISTING_FEE,
    areaSqft: '',
    document: '', // Initialize new document field
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>(''); // New state for PDF file name
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDocumentDragOver, setIsDocumentDragOver] = useState(false); // New state for PDF drag
  const { uploadAssetsCreation } = useIPFSUpload();


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) : value,
    }));
  };

  const handleImageChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (file: File) => {
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, document: reader.result as string }));
        setDocumentName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDocumentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDocumentChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    }
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDocumentDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleDocumentChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDocumentDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDocumentDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDocumentDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDocumentDragOver(false);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: '' }));
    setImagePreview(null);
    setFileName('');
  };

  const removeDocument = () => {
    setForm((prev) => ({ ...prev, document: '' }));
    setDocumentName('');
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      alert('Property added successfully!\n' + JSON.stringify(form, null, 2));
      
      // Transform form data to match AssetsCreationMetadata
      const assetsMetadata: AssetsCreationMetadata = {
        title: form.name,
        description: form.description,
        location: form.location,
        category: form.propertyType,
        value: form.value.toString(), // Ensure value is string
        tokens: Number(form.tokens), // Convert to number if needed
        currency: 'USDT',
        propertyType: form.propertyType as 'Residential' | 'Land' | 'Commercial' | 'Industrial',
        images: [], // Will handle file conversion
        documents: [], // Will handle file conversion
        validatorId: '',
        areaSqft: form.areaSqft.toString() // Convert number to string
      };

      const ipfsResults = await uploadAssetsCreation(assetsMetadata);
      console.log('IPFS Upload Results:', ipfsResults);

      // Reset form
      setForm({
        name: '',
        location: '',
        propertyType: 'Residential',
        status: 'Active',
        value: '',
        tokens: '0', // Convert to string
        invested: '',
        image: '',
        description: '',
        listingFee: FIXED_LISTING_FEE,
        areaSqft: '0', // Convert to string
        document: ''
      });
      setImagePreview(null);
      setFileName('');
      setDocumentName('');
      
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50  py-4 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            Add New Property
          </h1>
          <p className="text-gray-600 mt-1 text-sm">Fill in the details to list your property</p>
        </div>

        <div className="p-6">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Property Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Property Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    placeholder="Enter property name"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    placeholder="Enter property location"
                    required
                  />
                </div>
              </div>

              {/* Property Type and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    Property Type *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-8 py-3 focus:border-blue-500 focus:outline-none transition-colors appearance-none text-sm"
                      required
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Status
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-8 py-3 focus:border-blue-500 focus:outline-none transition-colors appearance-none text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Financial Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Property Value *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      placeholder="e.g., $250,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Amount Invested *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="invested"
                      value={form.invested}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      placeholder="e.g., $50,000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tokens and Listing Fee Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    Number of Tokens *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      name="tokens"
                      value={form.tokens}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      placeholder="Enter number of tokens"
                      min={0}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    Area (sq.ft)
                  </label>
                  <div className="relative">
                    <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={`$${form.areaSqft}`}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Listing Summary</h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <p><span className="font-medium">Listing Fee:</span> ${form.listingFee}</p>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Property Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-3 py-3 focus:border-blue-500 focus:outline-none transition-colors resize-vertical text-sm"
                    placeholder="Describe your property features, amenities, nearby facilities..."
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Image className="w-4 h-4 text-blue-600" />
                  Property Image *
                </label>
                
                {!imagePreview ? (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="space-y-3">
                      <div className="mx-auto w-16 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop image here or <span className="text-blue-600 cursor-pointer underline">browse files</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Property preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full transition-all duration-200 hover:bg-red-600 transform hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {fileName && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <Image className="w-4 h-4 text-blue-600" />
                        <span className="truncate font-medium">{fileName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Document Upload */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <File className="w-4 h-4 text-blue-600" />
                  Property Document (PDF)
                </label>
                
                {!documentName ? (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDocumentDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDocumentDrop}
                    onDragOver={handleDocumentDragOver}
                    onDragLeave={handleDocumentDragLeave}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleDocumentInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-3">
                      <div className="mx-auto w-16 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop PDF here or <span className="text-blue-600 cursor-pointer underline">browse files</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                      <File className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeDocument}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full transition-all duration-200 hover:bg-red-600 transform hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {documentName && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <File className="w-4 h-4 text-blue-600" />
                        <span className="truncate font-medium">{documentName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Summary Card */}

            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            >
              Add Property to Listing
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              By submitting, you agree to pay the listing fee of ${FIXED_LISTING_FEE}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;