import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, updateCategory, deleteCategory, createPath } from './hooks/useCategories';
import Admin from "./layouts/Admin";
import { IoIosAddCircle } from "react-icons/io";
import CategoryList from './components/categories/ListCategory';
import AddCategoryModal from './components/categories/AddCategoryModal';
import EditCategoryModal from './components/categories/EditCategoryModal';
import DeleteCategoryModal from './components/categories/CateDeleteModal';

const DanhMucSach = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!name || !imgFile) return;

        try {
            const newCategory = await addCategory(name, imgFile);
            setCategories([...categories, newCategory]);
            resetForm();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!name || !currentCategory) return;

        try {
            const updatedCategory = await updateCategory(currentCategory.id, name, imgFile, imgURL);
            setCategories(categories.map((category) =>
                category.id === currentCategory.id ? updatedCategory : category
            ));
            resetForm();
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteCategory(deleteCategoryId);
            setCategories(categories.filter(category => category.id !== deleteCategoryId));
            setIsDeleteConfirmOpen(false);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const resetForm = () => {
        setName('');
        setImgFile(null);
        setImgURL('');
        setCurrentCategory(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
            searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        )
    );

    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-6 transition-all duration-300 ease-in-out hover:text-blue-600">
                DANH MỤC SÁCH
            </h1>
            <input
                type="text"
                placeholder="Tìm kiếm theo tên không dấu"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 mb-4 w-full"
            />
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-cyan-500 text-white px-4 py-2 rounded mb-4 flex items-center font-semibold"
            >
                <IoIosAddCircle className="mr-2" /> Thêm danh mục mới
            </button>
            <CategoryList
                categories={categories}
                filteredCategories={filteredCategories}
                handleOpenEditModal={(category) => {
                    setCurrentCategory(category);
                    setName(category.name);
                    setImgURL(category.img);
                    setIsEditModalOpen(true);
                }}
                confirmDeleteCategory={(id) => {
                    setDeleteCategoryId(id);
                    setIsDeleteConfirmOpen(true);
                }}
            />
            <AddCategoryModal
                isOpen={isAddModalOpen}
                resetForm={resetForm}
                handleAddCategory={handleAddCategory}
                name={name}
                setName={setName}
                imgFile={imgFile}
                setImgFile={setImgFile}
                imgURL={imgURL}
                setImgURL={setImgURL}
            />
            <EditCategoryModal
                isOpen={isEditModalOpen}
                resetForm={resetForm}
                handleUpdateCategory={handleUpdateCategory}
                name={name}
                setName={setName}
                imgFile={imgFile}
                setImgFile={setImgFile}
                imgURL={imgURL}
                setImgURL={setImgURL}
            />
            <DeleteCategoryModal
                isOpen={isDeleteConfirmOpen}
                handleDeleteCategory={handleDeleteCategory}
                setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            />
        </div>
    );
};

DanhMucSach.layout = Admin;
export default DanhMucSach;
