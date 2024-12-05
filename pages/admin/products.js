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
    productsList.sort((a, b) => b.timestamp - a.timestamp);
    setProducts(productsList);
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

  //xóa sản phẩm
  // const handleDeleteProduct = async () => {
  //   if (!productToDelete) return;

  //   // Tìm sản phẩm cần xóa trong danh sách sản phẩm hiện có
  //   const product = products.find(p => p.id === productToDelete);

  //   // Kiểm tra nếu sản phẩm vẫn đang hiển thị
  //   if (!product || product.visible) {
  //     setDeleteError("Sản phẩm phải được ẩn trước khi xóa.");
  //     return;
  //   }

  //   try {
  //     await deleteDoc(doc(db, 'products', productToDelete));
  //     setProducts(products.filter(product => product.id !== productToDelete));
  //     closeDeleteModal();
  //     setDeleteError(""); // Xóa lỗi sau khi xóa thành công
  //   } catch (error) {
  //     console.error("Error deleting document: ", error);
  //     setDeleteError("Có lỗi xảy ra khi xóa sản phẩm.");
  //   }
  // };

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="relative container mx-auto p-4 mb-6 top-[100px]">
      <h1 className="text-2xl font-bold mb-4">QUẢN LÝ SÁCH</h1>
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
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa sản phẩm này?</h2>

            {/* Hiển thị lỗi nếu sản phẩm chưa ẩn */}
            {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}

            <div className="flex justify-center">
              {deleteError ? (
                // Chỉ hiển thị nút "OK" khi có lỗi
                <button
                  onClick={() => {
                    closeDeleteModal();
                    setDeleteError(""); // Đặt lại lỗi khi đóng modal
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                  OK
                </button>
              ) : (
                // Hiển thị nút "Xóa" và "Hủy" khi không có lỗi
                <>
                  <button
                    onClick={handleDeleteProduct}
                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition mr-2"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => {
                      closeDeleteModal();
                      setDeleteError(""); // Đặt lại lỗi khi đóng modal
                    }}
                    className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition"
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
Dashboard.layout = Admin;