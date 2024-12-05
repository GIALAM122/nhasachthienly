import { db, storage } from '@/feature/firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Tạo path từ tên danh mục
export const createPath = (name) => {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '');
};

// Lấy danh sách danh mục
export const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'DanhMucSach'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// Thêm danh mục mới
export const addCategory = async (name, imgFile) => {
    const storageRef = ref(storage, `images/${imgFile.name}`);
    await uploadBytes(storageRef, imgFile);
    const url = await getDownloadURL(storageRef);

    const path = createPath(name);
    const docRef = await addDoc(collection(db, 'DanhMucSach'), { name, img: url, path });

    return { id: docRef.id, name, img: url, path };
};

// Cập nhật danh mục
export const updateCategory = async (id, name, imgFile, currentImgURL) => {
    let url = currentImgURL;

    if (imgFile) {
        const storageRef = ref(storage, `images/${imgFile.name}`);
        await uploadBytes(storageRef, imgFile);
        url = await getDownloadURL(storageRef);
    }

    const path = createPath(name);
    await updateDoc(doc(db, 'DanhMucSach', id), { name, img: url, path });

    return { id, name, img: url, path };
};

// Xóa danh mục
export const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'DanhMucSach', id));
};
