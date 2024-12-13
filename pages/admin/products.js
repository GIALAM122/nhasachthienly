/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { db, storage } from '@/feature/firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Admin from "./layouts/Admin";
import { IoIosAddCircle } from "react-icons/io";
import { serverTimestamp } from 'firebase/firestore';
import AddProductModal from "./components/products/addBookModal";
import EditProductModal from "./components/products/editBookModal";
import Pagination from "./components/products/Pagination";
import BookTable from "./components/products/bookTable";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  

  //hiển thị sản phẩm
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsList = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp) : null
      };
    });
  
    // Lọc các sản phẩm có trường visible là true
    const visibleProducts = productsList.filter(product => product.visible === true);
  
    // Sắp xếp theo timestamp
    visibleProducts.sort((a, b) => b.timestamp - a.timestamp);
  
    // Cập nhật state
    setProducts(visibleProducts);
  };
  

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'DanhMucSach'));
    const categoriesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(categoriesList);
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  //Add sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageFile || selectedCategories.length === 0) return;
    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      const timestamp = new Date();
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        img: url,
        author,
        publisher,
        releaseDate,
        mota: description,
        categories: selectedCategories,
        timestamp: serverTimestamp(),
        visible: true
      });

      setProducts([...products, { name, price: parseFloat(price), author, publisher, releaseDate, mota: description, img: url, categories: selectedCategories, timestamp: timestamp.toISOString() }]);
      await fetchProducts();
      resetForm();

    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  //Sửa sản phẩm
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !author || !selectedCategories.length || !description || !currentProduct) return;

    try {
      let url = imageURL;

      if (imageFile) {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        url = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'products', currentProduct.id), {
        name,
        price: parseFloat(price),
        author,
        publisher,
        releaseDate,
        categories: selectedCategories,
        mota: description,
        img: url,
      });

      setProducts(products.map((product) =>
        product.id === currentProduct.id
          ? { ...product, name, price: parseFloat(price), author, publisher, releaseDate, categories: selectedCategories, mota: description, img: url }
          : product
      ));
      resetForm();
      await fetchProducts();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }

  };

  //Ẩn/Hiện sản phẩm
  const toggleProductVisibility = async (productId, currentVisibility) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        visible: !currentVisibility
      });
      setProducts(products.map(product =>
        product.id === productId ? { ...product, visible: !currentVisibility } : product
      ));
    } catch (error) {
      console.error("Error updating visibility: ", error);
    }
    await fetchProducts();
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price);
    setAuthor(product.author);
    setPublisher(product.publisher);
    setReleaseDate(product.releaseDate);
    setSelectedCategories(product.categories);
    setDescription(product.mota);
    setImageURL(product.img);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setAuthor('');
    setPublisher('');
    setReleaseDate('');
    setSelectedCategories('');
    setDescription('');
    setImageFile(null);
    setImageURL('');
    setPreviewImage('');
    setCurrentProduct(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  //tìm kiếm sản phẩm
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    const normalizedProductName = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const normalizedSearchTerm = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return normalizedProductName.toLowerCase().includes(normalizedSearchTerm.toLowerCase());
  });

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const allProducts = filteredProducts;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="relative container mx-auto p-4 mb-6 top-[100px]">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-6 transition-all duration-300 ease-in-out hover:text-blue-600">
        QUẢN LÝ SÁCH
      </h1>

      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-cyan-500 text-white px-4 py-2 rounded mb-4 flex items-center font-semibold"
      >
        <IoIosAddCircle className="mr-2" />
        Thêm sản phẩm mới
      </button>

      <BookTable
        currentProducts={currentProducts}
        handleOpenEditModal={handleOpenEditModal}
        toggleProductVisibility={toggleProductVisibility}
        openDeleteModal={openDeleteModal}
        allProducts={allProducts} 
        setCurrentPage={setCurrentPage}
      />
      <AddProductModal
        isAddModalOpen={isAddModalOpen}
        handleAddProduct={handleAddProduct}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        author={author}
        setAuthor={setAuthor}
        publisher={publisher}
        setPublisher={setPublisher}
        releaseDate={releaseDate}
        setReleaseDate={setReleaseDate}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        imageFile={imageFile}
        setImageFile={setImageFile}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        description={description}
        setDescription={setDescription}
        resetForm={resetForm}
      />
      {/* Edit Product Modal */}
      <EditProductModal
        isEditModalOpen={isEditModalOpen}
        currentProduct={currentProduct}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        author={author}
        setAuthor={setAuthor}
        publisher={publisher}
        setPublisher={setPublisher}
        releaseDate={releaseDate}
        setReleaseDate={setReleaseDate}
        description={description}
        setDescription={setDescription}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        imageURL={imageURL}
        setImageFile={setImageFile}
        setImageURL={setImageURL}
        handleUpdateProduct={handleUpdateProduct}
        resetForm={resetForm}
      />
      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
Dashboard.layout = Admin;